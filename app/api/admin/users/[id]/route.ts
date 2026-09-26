import { Admin } from "@/database/types";
import { deleteAdmin, fetchAdminDetails } from "@/services/adminService";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { successResponse } from "@/utilities/apiResponse";
import { RouteHandlerContext, withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { requireAdminRole } from "@/utilities/authorizationWrappers";
import { NextRequest } from "next/server";

type context = { id: string };

export type AdminFetchByIdResponseData = AdminDetails;
export const GET = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(
      ["super-admin"],
      async (_req, _adminPayload, context: RouteHandlerContext<context>) => {
        //is a get request, that passes through authentication first, and then the authorization, if both success, we just return the admin tables
        const { id } = await context.params;

        const adminUser: AdminDetails = await fetchAdminDetails(id);

        return successResponse(adminUser, "Admin Data successfully fetched.");
      },
    ),
  ),
);

export type AdminDeleteResponseData = AdminDetails;

export const DELETE = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(
      ["super-admin"],
      async (_req, adminPayload, context: RouteHandlerContext<context>) => {
        //is a get request, that passes through authentication first, and then the authorization, if both success, we just return the admin tables
        const { id } = await context.params;

        const deletedAdminUser: AdminDetails = await deleteAdmin(
          adminPayload.id,
          id,
        );

        return successResponse(deletedAdminUser, "Admin Successfully deleted.");
      },
    ),
  ),
);
