import { NextRequest, NextResponse } from "next/server";
import { RouteHandler, RouteHandlerContext } from "./apiRoute";

import jwt from "jsonwebtoken";
import { env } from "@/env";
import { ApiError } from "@/shared/errors/apiError";
import { JwtAdminPayload } from "@/shared/types/admin";
import { verifyAdminToken } from "./jwtUtils";

export type AdminAuthenticatedRouteHandler<T> = (
  req: NextRequest,
  adminPayload: JwtAdminPayload,
  context: RouteHandlerContext<T>,
) => Promise<NextResponse>;

export function requireAdminAuth<T>(
  authRequiredHandler: AdminAuthenticatedRouteHandler<T>,
): RouteHandler<T> {
  return async (req, context) => {
    const token = req.cookies.get("admin_access_token")?.value;
    if (!token) {
      throw ApiError.unauthorized("Admin is not logged in.");
    }

    const decodedToken = verifyAdminToken(token);

    if (!decodedToken) {
      throw ApiError.unauthorized("JWT couldn't be verified.");
    }

    return await authRequiredHandler(req, decodedToken, context);
  };
}
