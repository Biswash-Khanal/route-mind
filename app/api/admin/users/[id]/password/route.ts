import { forceChangeAdminPassword } from "@/services/adminService";
import { adminForcePasswordChangeSchema } from "@/shared/schemas/adminSchema";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { successResponse } from "@/utilities/apiResponse";
import { RouteHandlerContext, withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { requireAdminRole } from "@/utilities/authorizationWrappers";
import { AdminInformationChangeResponseData } from "../../../me/username/route";

type context = { id: string };

/**
 * Super-admin-only. Sets a new password for another admin without knowing their
 * current one, for recovering an account that is locked out.
 *
 * `forceChangeAdminPassword` refuses the case where the target is the caller, so
 * a super-admin cannot use this route to bypass the old-password check on their
 * own account.
 */
export const POST = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(
      ["super-admin"],
      async (
        req,
        adminPayload: JwtAdminPayload,
        context: RouteHandlerContext<context>,
      ) => {
        const body = await req.json();
        const { id } = await context.params;

        const parsed = adminForcePasswordChangeSchema.parse(body);

        const adminUser: AdminDetails = await forceChangeAdminPassword(
          adminPayload.id,
          id,
          parsed.newPassword,
        );

        return successResponse(
          adminUser as AdminInformationChangeResponseData,
          "Password reset successfully.",
        );
      },
    ),
  ),
);
