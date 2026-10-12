import { fetchAllAdmins, registerAdmin } from "@/services/adminService";
import { adminRegisterSchema } from "@/shared/schemas/adminSchema";
import { AdminDetails } from "@/shared/types/admin";
import { createdResponse, successResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { requireAdminRole } from "@/utilities/authorizationWrappers";
import { NextRequest } from "next/server";

export type AdminGetAllUsersResponseData = AdminDetails[];

export const GET = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(["super-admin"], async () => {
      // Authentication runs first, then authorization: only a super-admin ever
      // reaches the query below.
      const adminUsers: AdminDetails[] = await fetchAllAdmins();

      return successResponse(
        adminUsers as AdminGetAllUsersResponseData,
        "All admin data successfully fetched",
      );
    }),
  ),
);

export type AdminCreatedResponseData = AdminDetails;

export const POST = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(["super-admin"], async (req: NextRequest) => {
      const body = await req.json();
      const data = adminRegisterSchema.parse(body);

      const created = await registerAdmin(data);

      return createdResponse(
        created as AdminCreatedResponseData,
        "Admin created successfully",
      );
    }),
  ),
);
