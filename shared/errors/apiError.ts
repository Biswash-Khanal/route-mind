/**
 * ApiError — the "ticket" thrown by our own code when something is wrong.
 *
 * The design principle: native/library errors only tell you *what* happened,
 * but an HTTP API needs to know *how to respond*. ApiError carries exactly
 * that, on one object:
 *
 *   - statusCode  -> the HTTP status to send (404, 409, 422, ...)
 *   - code        -> stable machine-readable string for clients to branch on
 *   - message     -> safe, human-readable text (never SQL/stack internals)
 *   - details     -> optional structured payload (e.g. per-field validation)
 *   - cause       -> (inherited) the original underlying error, preserved so
 *                    the logger can keep the real root cause while the client
 *                    only ever sees the clean `message`.
 *
 * Services throw these; the `withErrorHandling` wrapper in utilities/apiRoute
 * catches them and mirrors the fields into the HTTP response.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    options: { details?: unknown; cause?: unknown } = {},
  ) {
    // Super takes the message for `error.message` and the `cause` so the
    // original error stays attachable for logging.
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = options.details;
  }

  /** 400 — the request itself was malformed/unacceptable. */
  static badRequest(
    message = "Bad request",
    options: { code?: string; details?: unknown } = {},
  ): ApiError {
    return new ApiError(400, options.code ?? "BAD_REQUEST", message, {
      details: options.details,
    });
  }

  /** 401 — caller isn't authenticated. */
  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(401, "UNAUTHORIZED", message);
  }

  /** 403 — caller is authenticated but lacks permission. */
  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(403, "FORBIDDEN", message);
  }

  /** 404 — the requested resource doesn't exist. */
  static notFound(message = "Resource not found"): ApiError {
    return new ApiError(404, "NOT_FOUND", message);
  }

  /**
   * 409 — an operation conflicted with existing data (e.g. a unique field
   * like username or email was already taken).
   *
   * Takes `options` like `badRequest` so a conflict can carry structured extras —
   * the delete endpoints use `details.dependents` to report how many rows still
   * reference the record being deleted.
   */
  static conflict(
    message = "Resource already exists",
    options: { code?: string; details?: unknown } = {},
  ): ApiError {
    return new ApiError(409, options.code ?? "CONFLICT", message, {
      details: options.details,
    });
  }

  /** 500 — used only as a last resort fallback; most 500s are the catch-all. */
  static internal(message = "Internal server error"): ApiError {
    return new ApiError(500, "SERVER_ERROR", message);
  }
}