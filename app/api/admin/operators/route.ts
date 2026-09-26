import { createOperator } from "@/services/operatorService";
import { operatorCreateSchema } from "@/shared/schemas/operatorSchema";
import { createdResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";

export const POST = withErrorHandling(
  requireAdminAuth(async (req) => {
    const body = await req.json();
    const parsed = operatorCreateSchema.parse(body);

    const createdOperator = await createOperator(parsed);

    return createdResponse(createdOperator, "Operator created successfully.");
  }),
);
