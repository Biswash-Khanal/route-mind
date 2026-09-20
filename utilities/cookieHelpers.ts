import { env } from "@/env";
import { NextResponse } from "next/server";

export function setAuthCookie(
  res: NextResponse,
  jwtToken: string,
  token_name: "admin_access_token" | "access_token",
): NextResponse {
  res.cookies.set(token_name, jwtToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return res;
}

export function clearAuthCookie(
  res: NextResponse,

  token_name: "admin_access_token" | "access_token",
): NextResponse {
  res.cookies.set(token_name, "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
