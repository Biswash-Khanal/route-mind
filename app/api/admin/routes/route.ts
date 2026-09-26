import { createRoute } from "@/services/routeService";
import { routeCreateSchema } from "@/shared/schemas/routeSchema";
import { RouteDetails } from "@/shared/types/route";
import { createdResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";

export type RouteCreatedResponseData = RouteDetails;

export const POST = withErrorHandling(
  requireAdminAuth(async (req) => {
    const body = await req.json();
    const parsed = routeCreateSchema.parse(body);

    const createdRoute = await createRoute(parsed);

    return createdResponse(createdRoute, "Route created successfully.");
  }),
);
