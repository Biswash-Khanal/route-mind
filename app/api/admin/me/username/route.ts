import { changeAdminUsername } from "@/services/adminService";
import { adminChangeUsernameSchema } from "@/shared/schemas/adminSchema";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { successResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";
import { NextRequest } from "next/server";
import z from "zod";

export const PATCH = withErrorHandling(
  requireAdminAuth(async (req: NextRequest, adminPayload: JwtAdminPayload) => {
    const body = await req.json();

    const parsed = adminChangeUsernameSchema.parse(body);

    const updatedAdmin: AdminDetails = await changeAdminUsername(
      adminPayload.id,
      parsed.username,
    );

    return successResponse(updatedAdmin, "Username changed successfully.");
  }),
);
