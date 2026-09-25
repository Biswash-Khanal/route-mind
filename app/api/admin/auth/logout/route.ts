import { NextRequest } from "next/server";

import { LoggedInAdminWithToken, loginAdmin } from "@/services/adminService";
import { adminLoginSchema } from "@/shared/schemas/adminSchema";
import { withErrorHandling } from "@/utilities/apiRoute";
import { noContentResponse, successResponse } from "@/utilities/apiResponse";
import { clearAuthCookie, setAuthCookie } from "@/utilities/cookieHelpers";

export type AdminLogoutResponseData = null;

export const POST = withErrorHandling(async (req: NextRequest) => {
  const response = successResponse(
    null as null,
    "Logged out successfully",
    200,
  );
  return clearAuthCookie(response, "admin_access_token");
});
