import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 10;

export async function hashedPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
