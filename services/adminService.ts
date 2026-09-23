import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import { db } from "@/database";
import { ApiError } from "@/shared/errors/apiError";
import {
  adminLoginSchemaType,
  adminRegisterSchemaType,
} from "@/shared/schemas/adminSchema";
import { TursoDate } from "@/utilities/dateUtils";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { NextRequest } from "next/server";
import { AdminDetails, JwtAdminPayload } from "@/shared/types/admin";
import { hashedPassword, verifyPassword } from "@/utilities/passwordUtils";
import { Admin } from "@/database/types";
import { Selectable } from "kysely";
import { signAdminToken } from "@/utilities/jwtUtils";

function mapToAdminDetails(admin: Selectable<Admin>): AdminDetails {
  return {
    id: admin.id,
    username: admin.username,
    firstName: admin.first_name,
    lastName: admin.last_name,
    middleName: admin.middle_name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.created_at,
    updatedAt: admin.updated_at,
  };
}
//----------------------------------------------------------------------------------//
export async function registerAdmin(
  data: adminRegisterSchemaType,
): Promise<AdminDetails> {
  // 1. Unique checks...
  const duplicateUsername = await db
    .selectFrom("admin")
    .select("id")
    .where("username", "=", data.username)
    .executeTakeFirst();

  if (duplicateUsername) {
    throw ApiError.conflict("Username already taken.");
  }

  const duplicateEmail = await db
    .selectFrom("admin")
    .select("id")
    .where("email", "=", data.email)
    .executeTakeFirst();

  if (duplicateEmail) {
    throw ApiError.conflict("Email already registered.");
  }

  // 2. Hash & prepare fields
  const id = randomUUID();
  const passwordHash = await hashedPassword(data.password);
  const now = TursoDate.toTurso(new Date());

  // 3. Insert and return the raw inserted row in ONE query
  const inserted = await db
    .insertInto("admin")
    .values({
      id,
      first_name: data.firstName,
      last_name: data.lastName,
      middle_name: data.middleName ?? null,
      username: data.username,
      email: data.email,
      role: data.role,
      password_hash: passwordHash,
      created_at: now,
      updated_at: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return mapToAdminDetails(inserted);
}
//----------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------//
export interface LoggedInAdminWithToken {
  admin: AdminDetails;
  token: string;
}

export async function loginAdmin(
  data: adminLoginSchemaType,
): Promise<LoggedInAdminWithToken> {
  //username check: Check if the database contains an account with this username. If not, return Incorrect username, else continue
  const adminWithUsername = await db
    .selectFrom("admin")
    .selectAll()
    .where("username", "=", data.username)
    .executeTakeFirst();

  if (!adminWithUsername) {
    throw ApiError.unauthorized("Invalid username or password.");
  }

  //Once confirmed that an account with this username does exist, test the password against the password hash, if no match, say incorrect password, if does match continue
  const passwordMatch = await verifyPassword(
    data.password,
    adminWithUsername.password_hash,
  );

  //if password not match, also throw the same vague error, if it does, we can continue
  if (!passwordMatch) {
    throw ApiError.unauthorized("Invalid username or password.");
  }

  const payload: JwtAdminPayload = {
    id: adminWithUsername.id,
    email: adminWithUsername.email,
    role: adminWithUsername.role,
  };

  //generate an access token
  const access_token = signAdminToken(payload);

  return {
    admin: mapToAdminDetails(adminWithUsername),
    token: access_token,
  };
}
//----------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------//
export async function fetchAdminDetails(id: string): Promise<AdminDetails> {
  const admin = await db
    .selectFrom("admin")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!admin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  // Transform snake_case database model to camelCase API DTO
  return mapToAdminDetails(admin);
}
//----------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------//

export async function changeAdminUsername(
  id: string,
  newUsername: string,
): Promise<AdminDetails> {
  const conflict = await db
    .selectFrom("admin")
    .select(["id", "username"])
    .where((eb) => eb.or([eb("id", "=", id), eb("username", "=", newUsername)]))
    .execute();

  if (conflict.length === 0) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  const currentAdmin = conflict.find((el) => el.id === id);
  if (!currentAdmin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  if (currentAdmin.username === newUsername) {
    throw ApiError.conflict("Cannot change username to what it already is.");
  }

  const duplicateUsername = conflict.find(
    (a) => a.username === newUsername && a.id !== id,
  );
  if (duplicateUsername) {
    throw ApiError.conflict("Username already taken.");
  }

  //username is unique, we can change it

  const now = TursoDate.toTurso(new Date());
  const updatedAdmin = await db
    .updateTable("admin")
    .set({ username: newUsername, updated_at: now })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!updatedAdmin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  return mapToAdminDetails(updatedAdmin);
}
//----------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------//

export async function changeAdminPassword(
  id: string,
  oldPassword: string,
  newPassword: string,
): Promise<AdminDetails> {
  // 1. Fetch current admin details
  const admin = await db
    .selectFrom("admin")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!admin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  // 2. First verify that oldPassword matches the stored hash
  const isOldMatch = await bcrypt.compare(oldPassword, admin.password_hash);
  if (!isOldMatch) {
    throw ApiError.unauthorized(
      "Old password did not match the current password.",
    );
  }

  // 3. Verify new password isn't identical to the current hash
  const isNewIdentical = await bcrypt.compare(newPassword, admin.password_hash);
  if (isNewIdentical) {
    throw ApiError.badRequest(
      "New password cannot be the same as your current password.",
    );
  }

  // 4. Hash new password and update database
  const now = TursoDate.toTurso(new Date());
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  const updatedAdmin = await db
    .updateTable("admin")
    .set({ password_hash: newPasswordHash, updated_at: now })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!updatedAdmin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  return mapToAdminDetails(updatedAdmin);
}
//----------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------//

export async function fetchAllAdmins(): Promise<AdminDetails[]> {
  const admins = await db.selectFrom("admin").selectAll().execute();

  if (!admins) {
    throw ApiError.unauthorized("No accounts found.");
  }

  //map the databse column name objects into camelcase ones matching our AdminDetails shape
  return admins.map(mapToAdminDetails);
}
//----------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------//
export async function forceChangeAdminPassword(
  callingAdminId: string,
  id: string,
  newPassword: string,
): Promise<AdminDetails> {
  if (id === callingAdminId) {
    throw ApiError.forbidden(
      "Super admins are not allowed to change their own passwords through this endpoint. Please use /admin/me/password instead.",
    );
  }
  // 1. Fetch the admin details and check for existence
  const admin = await db
    .selectFrom("admin")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!admin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  // 4. Hash new password and update database
  const now = TursoDate.toTurso(new Date());
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  const updatedAdmin = await db
    .updateTable("admin")
    .set({ password_hash: newPasswordHash, updated_at: now })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!updatedAdmin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  return mapToAdminDetails(updatedAdmin);
}
//----------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------//
export async function deleteAdmin(
  callingAdminId: string,
  id: string,
): Promise<AdminDetails> {
  if (callingAdminId === id) {
    throw ApiError.forbidden(
      "Super admins are not allowed to delete their own account.",
    );
  }

  // 1. Fetch the admin details and check for existence, while also saving a snapshot before deletion

  const admin = await db
    .selectFrom("admin")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!admin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  //check if the admin's role is super admin, if it is, it cant be deleted
  if (admin.role === "super-admin") {
    throw ApiError.forbidden("Super admin accounts cannot be deleted.");
  }

  const deletedResult = await db
    .deleteFrom("admin")
    .where("id", "=", id)
    .executeTakeFirst();

  const deletedCount = Number(deletedResult.numDeletedRows);

  if (deletedCount === 0) {
    throw ApiError.notFound("Admin account not found.");
  }

  if (deletedCount > 1) {
    throw ApiError.internal("Unexpected: multiple admin accounts deleted.");
  }

  return mapToAdminDetails(admin);
}
//----------------------------------------------------------------------------------//
