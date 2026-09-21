import { ApiError } from "@/shared/errors/apiError";
import { AvailableAdminRoles } from "@/shared/types/admin";
import { AdminAuthenticatedRouteHandler } from "./authenticationWrappers";

export function requireAdminRole<T>(
  allowedRoles: AvailableAdminRoles[],
  handler: AdminAuthenticatedRouteHandler<T>,
): AdminAuthenticatedRouteHandler<T> {
  return async (req, adminPayload, context) => {
    if (!allowedRoles.includes(adminPayload.role)) {
      throw ApiError.forbidden(
        `This service is only allowed for ${allowedRoles.join(",")}`,
      );
    }

    return await handler(req, adminPayload, context);
  };
}
