import { db } from "@/database";
import { registerAdmin } from "@/services/adminService";
import { adminRegisterSchema } from "@/shared/schemas/adminRegisterSchema";
import { errorResponse, successResponse } from "@/utilities/apiResponse";

import { NextRequest } from "next/server";
import z, { safeParse } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = adminRegisterSchema.safeParse(body);

    if (!parsedData.success) {
      return errorResponse(z.prettifyError(parsedData.error));
    }

    //databse logic, check for conflicting usernames, emails and if everything is fine, insert and return success
    return registerAdmin(parsedData.data);
  } catch (error) {
    return errorResponse("error");
  }
}
