import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { errorResponse } from "./utilities/apiResponse";
import { verifyAdminToken } from "./utilities/jwtUtils";
import { sanitizeCallbackUrl } from "./utilities/callbackUrl";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const adminToken = request.cookies.get("admin_access_token")?.value;

  // Already signed in? Never show the login form — go where they were headed.
  if (pathname.startsWith("/admin/login")) {
    const decodedToken = adminToken ? verifyAdminToken(adminToken) : null;

    if (!decodedToken) {
      return NextResponse.next();
    }

    const callbackUrl = sanitizeCallbackUrl(
      request.nextUrl.searchParams.get("callbackUrl"),
    );

    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    const decodedToken = adminToken ? verifyAdminToken(adminToken) : null;

    if (!decodedToken) {
      // Carry the intended destination through the login form so the user lands
      // where they were trying to go rather than on the default page.
      const loginUrlWithCallback = new URL("/admin/login", request.url);
      loginUrlWithCallback.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrlWithCallback);
    }
  }

  // API namespace.

  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login") &&
    !pathname.startsWith("/api/admin/auth/logout")
  ) {
    // Cheap pre-check only. Token presence first, then a shape test (a JWT is
    // three dot-separated parts). This is deliberately NOT cryptographic — the
    // real verification is `requireAdminAuth` inside the route handler, which is
    // the actual security boundary. This just avoids waking a handler for a
    // request that was never going to authenticate.
    const hasToken = request.cookies.get("admin_access_token")?.value;

    if (!hasToken) {
      return errorResponse("Admin is not logged in.", 401, "UNAUTHORIZED");
    }

    if (hasToken.split(".").length !== 3) {
      return errorResponse("Admin is not logged in.", 401, "UNAUTHORIZED");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // All admin pages.
    "/admin/:path*",

    // All admin API routes. Login/logout are excluded in the function body above,
    // because they have to stay reachable while signed out.
    "/api/admin/:path*",
  ],
};
