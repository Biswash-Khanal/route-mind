import { deleteRoute, updateRoute } from "@/services/routeService";
import { routeUpdateSchema } from "@/shared/schemas/routeSchema";
import { successResponse } from "@/utilities/apiResponse";
import { RouteHandlerContext, withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";

type context = { id: string };

export const PATCH = withErrorHandling(
  requireAdminAuth(async (req, _admin, ctx: RouteHandlerContext<context>) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = routeUpdateSchema.parse(body);

    const updatedRoute = await updateRoute(id, parsed);

    return successResponse(updatedRoute, "Route updated successfully.");
  }),
);

export const DELETE = withErrorHandling(
  requireAdminAuth(async (req, _admin, ctx: RouteHandlerContext<context>) => {
    const { id } = await ctx.params;

    // A route that still has stop links or shape points is refused with a 409 listing
    // the dependent counts. `?force=true` is the deliberate override: shape points are
    // hand-entered geometry, so the client should send it only after the user has
    // confirmed the loss.
    const force = req.nextUrl.searchParams.get("force") === "true";

    const deletedRoute = await deleteRoute(id, force);

    return successResponse(deletedRoute, "Route deleted successfully.");
  }),
);
