import { fetchAllOperators } from "@/services/operatorService";
import { OperatorDetails } from "@/shared/types/operator";
import { successResponse } from "@/utilities/apiResponse";
import { withErrorHandling } from "@/utilities/apiRoute";

export type OperatorGetAllResponseData = OperatorDetails[];

/**
 * Public read endpoint for operators.
 *
 * Operators hold no sensitive fields, so this is intentionally unauthenticated and
 * lives outside the `/api/admin` namespace — which also keeps it clear of both
 * `proxy.ts` matchers, so no middleware change is needed to expose it.
 */
export const GET = withErrorHandling(async () => {
  const operators = await fetchAllOperators();

  return successResponse(operators, "Operators fetched successfully.");
});
