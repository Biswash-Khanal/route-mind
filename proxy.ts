import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ApiError } from "./shared/errors/apiError";
import { errorResponse } from "./utilities/apiResponse";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/logout")
  ) {
    //very basic check for token existence
    const hasToken = request.cookies.get("admin_access_token")?.value;

    if (!hasToken) {
      return errorResponse("Admin is not logged in.", 401, "UNAUTHORIZED");
    } else {
      //simple check for existing token's shape. We dont do the cryptographical verification in the edge middleware
      if (hasToken.split(".").length !== 3) {
        return errorResponse("Admin is not logged in.", 401, "UNAUTHORIZED");
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    //all frontend admin routes
    "/admin/:path*",

    //all backend admin api routes, exclusions to be dealt with manually in the function body
    "/api/admin/:path*",
  ],
};
