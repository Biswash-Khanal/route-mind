import { createStop } from "@/services/stopService";
import { stopCreateSchema } from "@/shared/schemas/stopSchema";
import { StopDetails } from "@/shared/types/stop";
import { createdResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";

export type StopCreatedResponseData = StopDetails;

export const POST = withErrorHandling(
  requireAdminAuth(async (req) => {
    const body = await req.json();
    const parsed = stopCreateSchema.parse(body);

    const createdStop = await createStop(parsed);

    return createdResponse(createdStop, "Stop created successfully.");
  }),
);
