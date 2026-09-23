import { env } from "@/env";
import { JwtAdminPayload } from "@/shared/types/admin";
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = env.JWT_ACCESS_SECRET;
const DEFAULT_EXPIRE_TIME = "1d";

export function signAdminToken(
  payload: JwtAdminPayload,
  expiresIn: SignOptions["expiresIn"] = DEFAULT_EXPIRE_TIME,
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyAdminToken(token: string): JwtAdminPayload | null {
  try {
    const payload: JwtAdminPayload = jwt.verify(
      token,
      JWT_SECRET,
    ) as JwtAdminPayload;
    return payload;
  } catch (error) {
    return null;
  }
}
