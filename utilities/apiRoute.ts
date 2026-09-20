import { NextRequest, NextResponse } from "next/server";
import { ZodError, flattenError } from "zod";

import { ApiError } from "@/shared/errors/apiError";
import { errorResponse } from "@/utilities/apiResponse";
import { JsonWebTokenError } from "jsonwebtoken";

type RouteHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

/**
 * Normalizes an unknown thrown value into a shape that is safe and useful to log.
 *
 * The `catch` parameter is typed `unknown` because a thrown value is not
 * guaranteed to be an `Error`. Real-world failures fall into three buckets,
 * and this helper handles all of them:
 *
 *   1. Error instances (most libraries: zod, Kysely, drivers, ...) ->
 *      capture name/message, any extra structured props (e.g. a DB `code`),
 *      the stack, and the full `cause` chain. The root cause at the bottom
 *      of the chain is where driver/database details usually live.
 *   2. Plain objects -> log as-is; the logger/console prints their structure.
 *   3. Primitives (`throw "boom"`) -> best-effort String().
 *
 * Note: we deliberately do NOT send any of this to the client. Logging is
 * liberal; the response is strictly generic (see the catch-all branch).
 */

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
 * Wraps an API route handler so that every failure funnels through one place.
 *
 * The wrapper is a *classifier*: it asks "what kind of error was thrown?" and
 * decides how to respond. It is the only code that knows how to translate a
 * failure into an HTTP response, so routes and services never do.
 *
 *   - ApiError   -> already carries a status/code/message; safe to reflect back.
 *   - ZodError   -> input failed validation; always a 422 with a per-field map.
 *   - SyntaxError-> `req.json()` failed; malformed body, 400.
 *   - anything   -> an unexpected bug; log everything, respond generically.
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
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

      // Unknown/unexpected error (DB down, coding bug, ...). Log the full
      // details, including the cause chain, for debugging — but reply with a
      // generic message so internals never leak to the client.
      console.error("Unhandled error:", normalizeErrorForLog(error));
      return errorResponse("Internal server error", 500, "SERVER_ERROR");
    }
  };
}
