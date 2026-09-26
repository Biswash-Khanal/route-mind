import {
  fetchAdminDetails,
  fetchAllAdmins,
  forceChangeAdminPassword,
} from "@/services/adminService";
import { ApiError } from "@/shared/errors/apiError";
import { adminForcePasswordChangeSchema } from "@/shared/schemas/adminSchema";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { successResponse } from "@/utilities/apiResponse";
import { RouteHandlerContext, withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { requireAdminRole } from "@/utilities/authorizationWrappers";
import { NextRequest } from "next/server";
import { AdminInformationChangeResponseData } from "../../../me/username/route";

type context = { id: string };

export const POST = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(
      ["super-admin"],
      async (req, adminPayload, context: RouteHandlerContext<context>) => {
        //is a get request, that passes through authentication first, and then the authorization, if both success, we just return the admin tables
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
          "Admin Data successfully fetched.",
        );
      },
    ),
  ),
);
