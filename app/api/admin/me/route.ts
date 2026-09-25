import { NextRequest } from "next/server";

import { withErrorHandling } from "@/utilities/apiRoute";
import { successResponse } from "@/utilities/apiResponse";

import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { fetchAdminDetails } from "@/services/adminService";

export type AdminGetDetailsResponseData = AdminDetails;

export const GET = withErrorHandling(
  requireAdminAuth(async (req: NextRequest, admin: JwtAdminPayload) => {
    const adminDetails: AdminDetails = await fetchAdminDetails(admin.id);

    return successResponse(adminDetails, "Admin Data fetched successfully.");
  }),
);
