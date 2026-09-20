import { NextRequest } from "next/server";

import {
  AdminDetails,
  fetchAdminDetails,
  LoggedInAdmin,
  LoggedInAdminWithToken,
  loginAdmin,
} from "@/services/adminService";
import { adminLoginSchema } from "@/shared/schemas/adminSchema";
import { withErrorHandling } from "@/utilities/apiRoute";
import { successResponse } from "@/utilities/apiResponse";
import { setAuthCookie } from "@/utilities/cookieHelpers";
import { ApiError } from "@/shared/errors/apiError";

import jwt from "jsonwebtoken";
import { env } from "@/env";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const token = req.cookies?.get("admin_access_token")?.value;
  if (!token) {
    throw ApiError.unauthorized("Authentication token not found");
  }
  const adminDetails: AdminDetails = await fetchAdminDetails(token);

  return successResponse(adminDetails, "Admin Data fetched successfully.");
});
