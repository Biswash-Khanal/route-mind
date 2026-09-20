import { NextRequest, NextResponse } from "next/server";
import { RouteHandler } from "./apiRoute";

import jwt from "jsonwebtoken";
import { env } from "@/env";
import { ApiError } from "@/shared/errors/apiError";
import { JwtAdminPayload } from "@/shared/types/admin";

export type AdminAuthenticatedRouteHandler = (
  req: NextRequest,
  adminPayload: JwtAdminPayload,
  context: Promise<Record<string, string | string[]>>,
) => Promise<NextResponse>;

export function requireAdminAuth(
  authRequiredHandler: AdminAuthenticatedRouteHandler,
): RouteHandler {
  return async (req, context) => {
    const token = req.cookies.get("admin_access_token")?.value;
    if (!token) {
      throw ApiError.unauthorized("Admin is not logged in.");
    }

    const decodedToken: JwtAdminPayload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as JwtAdminPayload;

    return await authRequiredHandler(req, decodedToken, context);
  };
}
