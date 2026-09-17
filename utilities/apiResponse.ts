import { NextResponse } from "next/server";

interface ApiResponse<T> {
  success: boolean;     //true or false
  statusCode: number;   //http status code
  message?: string;   // human readable summary of the response/ optional
  code?: string;      // machine-readable error/success code / optional
  data?: T;           // payload for success
  error?: string | object; // payload for error. Can be stringified, or an error object/custom shape
  details?: unknown;  // optional extra info (validation errors, stack trace in dev)
  timestamp: string;  // ISO timestamp for debugging
};


function baseResponse<T>(
  payload: Partial<ApiResponse<T>>,
  status: number
): NextResponse {
  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      statusCode: status,
      ...payload,
    },
    { status }
  );
}

export function successResponse<T>(
  data: T,
  message = "OK",
  status = 200,
  code = "SUCCESS"
): NextResponse {
  return baseResponse<T>({ success: true, data, message, code }, status);
}

export function errorResponse(
  message: string | object,
  status = 400,
  code = "ERROR",
  details?: unknown
): NextResponse {
  return baseResponse({ success: false, error: message, message: String(message), code, details }, status);
}

export function notFoundResponse(resource = "Resource"): NextResponse {
  return errorResponse(`${resource} not found`, 404, "NOT_FOUND");
}

export function unauthorizedResponse(reason = "Unauthorized"): NextResponse {
  return errorResponse(reason, 401, "UNAUTHORIZED");
}

export function forbiddenResponse(reason = "Forbidden"): NextResponse {
  return errorResponse(reason, 403, "FORBIDDEN");
}

export function conflictResponse(resource = "Resource"): NextResponse {
  return errorResponse(`${resource} already exists`, 409, "CONFLICT");
}

export function validationErrorResponse(errors: object): NextResponse {
  return errorResponse("Validation failed", 422, "VALIDATION_ERROR", errors);
}

export function serverErrorResponse(error?: unknown): NextResponse {
  console.error("Server error:", error);
  return errorResponse("Internal server error", 500, "SERVER_ERROR");
}