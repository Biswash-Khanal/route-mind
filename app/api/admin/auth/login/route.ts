import { NextRequest } from "next/server";

import { LoggedInAdminWithToken, loginAdmin } from "@/services/adminService";
import { adminLoginSchema } from "@/shared/schemas/adminSchema";
import { withErrorHandling } from "@/utilities/apiRoute";
import { successResponse } from "@/utilities/apiResponse";
import { setAuthCookie } from "@/utilities/cookieHelpers";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const data = adminLoginSchema.parse(body);

  const loggedInAdmin: LoggedInAdminWithToken = await loginAdmin(data);

  const response = successResponse(
    loggedInAdmin.admin,
    "Logged in Successfully.",
    201,
  );

  return setAuthCookie(response, loggedInAdmin.token, "admin_access_token");
});
