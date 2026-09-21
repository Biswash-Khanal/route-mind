import { fetchAllAdmins, registerAdmin } from "@/services/adminService";
import { adminRegisterSchema } from "@/shared/schemas/adminSchema";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { createdResponse, successResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { requireAdminRole } from "@/utilities/authorizationWrappers";
import { NextRequest } from "next/server";

export const GET = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(["super-admin"], async () => {
      //is a get request, that passes through authentication first, and then the authorization, if both success, we just return the admin tables
      const adminUsers: AdminDetails[] = await fetchAllAdmins();

      return successResponse(adminUsers, "All admin data successfully fetched");
    }),
  ),
);

export const POST = withErrorHandling(
  requireAdminAuth(
    requireAdminRole(["super-admin"], async (req: NextRequest) => {
      const body = await req.json();
      const data = adminRegisterSchema.parse(body);

      const created = await registerAdmin(data);

      return createdResponse(created, "Admin created successfully");
    }),
  ),
);
