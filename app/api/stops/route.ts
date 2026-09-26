import { fetchAllStops } from "@/services/stopService";
import { StopDetails } from "@/shared/types/stop";
import { successResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";

export type StopGetAllResponseData = StopDetails[];

/**
 * Public read endpoint for stops.
 *
 * Stops hold no sensitive fields, so this is intentionally unauthenticated and lives
 * outside the `/api/admin` namespace — which also keeps it clear of both `proxy.ts`
 * matchers, so no middleware change is needed to expose it.
 */
export const GET = withErrorHandling(async () => {
  const stops = await fetchAllStops();

  return successResponse(stops, "Stops fetched successfully.");
});
