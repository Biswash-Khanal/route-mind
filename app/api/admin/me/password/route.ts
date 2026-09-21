import { changeAdminPassword } from "@/services/adminService";
import { adminChangePasswordSchema } from "@/shared/schemas/adminSchema";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { successResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { clearAuthCookie } from "@/utilities/cookieHelpers";
import { NextRequest } from "next/server";

export const POST = withErrorHandling(
  requireAdminAuth(async (req: NextRequest, adminPayload: JwtAdminPayload) => {
    const body = await req.json();

    const parsed = adminChangePasswordSchema.parse(body);

    const updatedAdmin: AdminDetails = await changeAdminPassword(
      adminPayload.id,
      parsed.oldPassword,
      parsed.newPassword,
    );

    const response = successResponse(
      updatedAdmin,
      "Password changed successfully.",
    );

    return clearAuthCookie(response, "admin_access_token");
  }),
);
