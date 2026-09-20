import { NextRequest } from "next/server";

import { registerAdmin } from "@/services/adminService";
import { adminRegisterSchema } from "@/shared/schemas/adminSchema";
import { withErrorHandling } from "@/utilities/apiRoute";
import { createdResponse, successResponse } from "@/utilities/apiResponse";

/**
 * POST /api/admin/register — create a new admin.
 *
 * The route only says WHAT to do; it never handles failure itself:
 *   - bad JSON body        -> wrapper returns 400
 *   - zod validation fail  -> `parse` throws -> wrapper returns 422 + field map
 *   - ApiError from service-> wrapper returns its status/code/message
 *   - anything unexpected  -> wrapper logs and returns a generic 500
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const data = adminRegisterSchema.parse(body);

  const created = await registerAdmin(data);

  return createdResponse(created, "Admin created successfully");
});
