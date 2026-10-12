import { deleteAdmin, fetchAdminDetails } from "@/services/adminService";
import { AdminDetails } from "@/shared/types/admin";
import { successResponse } from "@/utilities/apiResponse";
import { RouteHandlerContext, withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { requireAdminRole } from "@/utilities/authorizationWrappers";

type context = { id: string };

export type AdminFetchByIdResponseData = AdminDetails;

/** Super-admin only: reads another admin's record. */
export const GET = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(
      ["super-admin"],
      async (_req, _adminPayload, ctx: RouteHandlerContext<context>) => {
        const { id } = await ctx.params;

        const adminUser: AdminDetails = await fetchAdminDetails(id);

        return successResponse(adminUser, "Admin Data successfully fetched.");
      },
    ),
  ),
);

export type AdminDeleteResponseData = AdminDetails;

/**
 * Super-admin only. `deleteAdmin` enforces the two rules the service cannot
 * assume: a super-admin may not delete themselves, and a super-admin account
 * may not be deleted at all.
 */
export const DELETE = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(
      ["super-admin"],
      async (_req, adminPayload, ctx: RouteHandlerContext<context>) => {
        const { id } = await ctx.params;

        const deletedAdminUser: AdminDetails = await deleteAdmin(
          adminPayload.id,
          id,
        );

        return successResponse(deletedAdminUser, "Admin Successfully deleted.");
      },
    ),
  ),
);