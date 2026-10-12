// database/scripts/seeds/super_admin.ts
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import { db } from "../../index";
import { TursoDate } from "@/utilities/dateUtils";

export async function seedSuperAdmin(): Promise<void> {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const username = process.env.SUPER_ADMIN_USERNAME;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !username || !password) {
    throw new Error(
      "Missing super admin env vars: SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME, SUPER_ADMIN_PASSWORD",
    );
  }

  const exists = await db
    .selectFrom("admin")
    .select("id")
    .where("email", "=", email)
    .executeTakeFirst();

  if (exists) {
    console.log(`ℹ️ Super admin with email ${email} already exists`);
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const now = TursoDate.toTurso(new Date());

  await db
    .insertInto("admin")
    .values({
      id: randomUUID(),
      first_name: "Super",
      last_name: "Admin",
      email,
      username,
      password_hash,
      role: "super-admin",
      created_at: now,
      updated_at: now,
    })
    .execute();

  console.log(`✅ Seeded super admin: ${username}`);
}
