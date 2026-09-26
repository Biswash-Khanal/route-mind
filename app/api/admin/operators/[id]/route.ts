import {
  createOperator,
  deleteOperator,
  updateOperator,
} from "@/services/operatorService";
import {
  operatorCreateSchema,
  operatorUpdateSchema,
} from "@/shared/schemas/operatorSchema";
import { createdResponse, successResponse } from "@/utilities/apiResponse";
import { RouteHandlerContext, withErrorHandling } from "@/utilities/apiRoute";
import { requireAdminAuth } from "@/utilities/authenticationWrappers";

type context = { id: string };

export const PATCH = withErrorHandling(
  requireAdminAuth(async (req, _admin, ctx: RouteHandlerContext<context>) => {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = operatorUpdateSchema.parse(body);

    const updatedOperator = await updateOperator(id, parsed);

    return successResponse(updatedOperator, "Operator Updated successfully.");
  }),
);

export const DELETE = withErrorHandling(
  requireAdminAuth(async (req, _admin, ctx: RouteHandlerContext<context>) => {
    const { id } = await ctx.params;

    // An operator that still owns routes is refused with a 409 listing the dependent
    // counts. `?force=true` is the deliberate override: it also drops those routes'
    // stop links and shape points, so the client should send it only after the user
    // has confirmed the loss.
    const force = req.nextUrl.searchParams.get("force") === "true";

    const deletedOperator = await deleteOperator(id, force);

    return successResponse(deletedOperator, "Operator deleted successfully.");
  }),
);
