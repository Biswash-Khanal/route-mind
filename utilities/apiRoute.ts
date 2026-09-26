import { NextRequest, NextResponse } from "next/server";
import { ZodError, flattenError } from "zod";

import { ApiError } from "@/shared/errors/apiError";
import { errorResponse } from "@/utilities/apiResponse";
import { JsonWebTokenError } from "jsonwebtoken";

//finally fixed this shit

//This is a wrapper type for the context argument. Pass T= whatever the shape of the params: is expected to be
export type RouteHandlerContext<T> = { params: Promise<T> };

//This is the type for a regular route handling function. Includes the generic type T which gets infered from the <T> part passed to the context's RouteHandlerContext's T
export type RouteHandler<T> = (
  req: NextRequest,
  context: RouteHandlerContext<T>,
) => Promise<NextResponse>;

function normalizeErrorForLog(error: unknown): unknown {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      // Libraries often attach structured data (e.g. zod's counter, a DB code).
      ...("code" in error
        ? { code: (error as Error & { code?: unknown }).code }
        : {}),
      stack: error.stack,
      // Recursively flatten the underlying causes so the root reason is visible.
      cause:
        error.cause !== undefined
          ? normalizeErrorForLog(error.cause)
          : undefined,
    };
  }

  if (typeof error === "object" && error !== null) {
    return error;
  }

  return String(error);
}

/**
 * Detects a database foreign-key violation.
 *
 * The schema uses ON DELETE RESTRICT, so the database itself refuses to delete a
 * parent row that still has children. This is the backstop for that guarantee: if a
 * delete endpoint ever forgets its `assert…Unlinked` guard, the request fails safely
 * with a 409 instead of destroying dependent rows.
 *
 * libsql reports this as a `SQLITE_CONSTRAINT_FOREIGNKEY` error code.
 */
function isForeignKeyViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("SQLITE_CONSTRAINT_FOREIGNKEY")
  );
}

export function withErrorHandling<T>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      // Our own labeled ticket: the service already decided the status, code,
      // and safe message, so we just mirror its fields into the response.
      if (error instanceof ApiError) {
        return errorResponse(
          error.message,
          error.statusCode,
          error.code,
          error.details,
        );
      }

      // Validation failure thrown by `schema.parse(...)`. Zod v4's `flattenError`
      // collapses the raw `issues` list into `{ formErrors, fieldErrors }` —
      // the canonical machine-readable shape (ideal for client-side form libs).
      if (error instanceof ZodError) {
        return errorResponse(
          "Validation failed",
          422,
          "VALIDATION_ERROR",
          flattenError(error),
        );
      }

      // `await req.json()` throws a SyntaxError on malformed/empty JSON bodies.
      if (error instanceof SyntaxError) {
        return errorResponse("Malformed JSON body", 400, "BAD_JSON");
      }

      //add the jsonwebtoken error, for errors concerning with the jwt token decoding
      if (error instanceof JsonWebTokenError) {
        return errorResponse(
          `JWT Error: ${error.message}`,
          401,
          error.name.toUpperCase(),
        );
      }

      // Backstop for the schema's ON DELETE RESTRICT. The delete endpoints check
      // dependents up front and return a richer 409 with counts; this only fires if
      // one of those guards is missing.
      if (isForeignKeyViolation(error)) {
        return errorResponse(
          "Cannot delete: other records still reference this one.",
          409,
          "FK_CONSTRAINT",
        );
      }

      // Unknown/unexpected error (DB down, coding bug, ...). Log the full
      // details, including the cause chain, for debugging — but reply with a
      // generic message so internals never leak to the client.
      console.error("Unhandled error:", normalizeErrorForLog(error));
      return errorResponse("Internal server error", 500, "SERVER_ERROR");
    }
  };
}
