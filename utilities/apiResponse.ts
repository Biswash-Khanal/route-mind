import { NextResponse } from "next/server";

/**
 * Response contract shared by every API endpoint.
 *
 * Every response looks like this (with `data` on success or `details` on
 * error, never both in practice):
 *
 *   {
 *     success:  boolean   // did the operation succeed?
 *     code:     string    // stable machine-readable identifier ("SUCCESS", "CONFLICT", ...)
 *     message:  string    // human-readable string safe to show to users
 *     data?:    unknown   // success payload
 *     details?: unknown   // structured error extras (e.g. zod field errors)
 *     timestamp: string   // ISO time, for debugging/correlation
 *   }
 *
 * Deliberate design choices:
 *   - `statusCode` is NOT duplicated in the body — the HTTP status already
 *     carries it, so the two can never drift apart.
 *   - Error internals (stacks, DB messages, zod `input`) never reach the body;
 *     those go to the log only (see normalizeErrorForLog in apiRoute.ts).
 */

function baseResponse(
  payload: { success: boolean; code: string; message: string },
  status: number,
  extra?: { data?: unknown; details?: unknown },
): NextResponse {
  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      ...payload,
      ...extra,
    },
    { status },
  );
}

export function successResponse<T>(
  data: T,
  message = "OK",
  status = 200,
  code = "SUCCESS",
): NextResponse {
  return baseResponse({ success: true, code, message }, status, { data });
}

// 201 — resource created
export function createdResponse<T>(
  data: T,
  message = "Resource created",
  code = "CREATED",
): NextResponse {
  return successResponse(data, message, 201, code);
}

// 202 — accepted for async processing
export function acceptedResponse<T>(
  data: T,
  message = "Request accepted",
  code = "ACCEPTED",
): NextResponse {
  return successResponse(data, message, 202, code);
}

// 204 — no content (data omitted)
export function noContentResponse(
  message = "No content",
  code = "NO_CONTENT",
): NextResponse {
  return baseResponse({ success: true, code, message }, 200);
}

export function errorResponse(
  message: string,
  status = 400,
  code = "ERROR",
  details?: unknown,
): NextResponse {
  return baseResponse(
    { success: false, code, message },
    status,
    details !== undefined ? { details } : undefined,
  );
}
