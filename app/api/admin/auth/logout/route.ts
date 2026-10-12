import { withErrorHandling } from "@/utilities/apiRoute";
import { successResponse } from "@/utilities/apiResponse";
import { clearAuthCookie } from "@/utilities/cookieHelpers";

export type AdminLogoutResponseData = null;

/**
 * Signs the caller out.
 *
 * There is nothing to invalidate server-side — the token is stateless and simply
 * stops being presented — so this only clears the cookie. The client must then
 * navigate, because the page it is currently showing was already rendered while
 * authenticated and would otherwise stay visible.
 */
export const POST = withErrorHandling(async () => {
  const response = successResponse(null, "Logged out successfully");

  return clearAuthCookie(response, "admin_access_token");
});
