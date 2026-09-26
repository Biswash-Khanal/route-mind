import { deleteStop, updateStop } from "@/services/stopService";
import { stopUpdateSchema } from "@/shared/schemas/stopSchema";
import { successResponse } from "@/utilities/apiResponse";
import { RouteHandlerContext, withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";

type context = { id: string };

export const PATCH = withErrorHandling(
  requireAdminAuth(async (req, _admin, ctx: RouteHandlerContext<context>) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = stopUpdateSchema.parse(body);

    const updatedStop = await updateStop(id, parsed);

    return successResponse(updatedStop, "Stop updated successfully.");
  }),
);

export const DELETE = withErrorHandling(
  requireAdminAuth(async (req, _admin, ctx: RouteHandlerContext<context>) => {
    const { id } = await ctx.params;

    // A stop that routes still link to is refused with a 409 listing the dependent
    // counts. `?force=true` is the deliberate override: the client should only send it
    // after the user has confirmed that losing those links is intended.
    const force = req.nextUrl.searchParams.get("force") === "true";

    const deletedStop = await deleteStop(id, force);

    return successResponse(deletedStop, "Stop deleted successfully.");
  }),
);
