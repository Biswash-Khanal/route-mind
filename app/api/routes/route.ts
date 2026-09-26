import { fetchAllRoutes } from "@/services/routeService";
import { RouteDetails } from "@/shared/types/route";
import { successResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";

export type RouteGetAllResponseData = RouteDetails[];

/**
 * Public read endpoint for routes.
 *
 * Routes hold no sensitive fields, so this is intentionally unauthenticated and
 * lives outside the `/api/admin` namespace — which also keeps it clear of both
 * `proxy.ts` matchers, so no middleware change is needed to expose it.
 */
export const GET = withErrorHandling(async () => {
  const routes = await fetchAllRoutes();

  return successResponse(routes, "Routes fetched successfully.");
});
