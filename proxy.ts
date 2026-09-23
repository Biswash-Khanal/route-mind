import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ApiError } from "./shared/errors/apiError";
import { errorResponse } from "./utilities/apiResponse";
import { verifyAdminToken } from "./utilities/jwtUtils";
import { redirect } from "next/navigation";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const adminToken = request.cookies.get("admin_access_token")?.value;

  //if login page accessed when already logged in, go to the callback url if exists, else go to /admin
  if (pathname.startsWith("/admin/login")) {
    const decodedToken = adminToken ? verifyAdminToken(adminToken) : null;

    if (!decodedToken) {
      return NextResponse.next();
    }

    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    
    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    } else {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    const decodedToken = adminToken ? verifyAdminToken(adminToken) : null;

    if (!decodedToken) {
      // Redirect unauthenticated users
      const loginUrlWithCallback = new URL("/admin/login", request.url);
      loginUrlWithCallback.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrlWithCallback);
    }
  }

  //for backend paths

  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login") &&
    !pathname.startsWith("/api/admin/auth/logout")
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
