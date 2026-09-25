import { ApiEnvelope } from "@/shared/types/api";
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

function baseResponse<TData, TDetails>(
  payload: { success: boolean; code: string; message: string },
  status: number,
  extra?: { data?: TData; details?: TDetails },
): NextResponse<ApiEnvelope<TData, TDetails>> {
  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      ...payload,
      ...extra,
    } as ApiEnvelope<TData, TDetails>,
    { status },
  );
}

export function successResponse<TData = unknown>(
  data: TData,
  message = "OK",
  status = 200,
  code = "SUCCESS",
): NextResponse<ApiEnvelope<TData, unknown>> {
  return baseResponse({ success: true, code, message }, status, { data });
}

export function errorResponse<TDetails = unknown>(
  message: string,
  status = 400,
  code = "ERROR",
  details?: TDetails,
): NextResponse<ApiEnvelope<unknown, TDetails>> {
  return baseResponse(
    { success: false, code, message },
    status,
    details !== undefined ? { details } : undefined,
  );
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
  return successResponse(null, message, 200, code);
}
