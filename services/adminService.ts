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
  const hashedPassword = await bcrypt.hash(data.password, 10);
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
      password_hash: hashedPassword,
      created_at: now,
      updated_at: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return {
    id: inserted.id,
    username: inserted.username,
    email: inserted.email,
    firstName: inserted.first_name,
    lastName: inserted.last_name,
    middleName: inserted.middle_name,
    role: inserted.role,
    createdAt: inserted.created_at,
    updatedAt: inserted.updated_at,
  };
}

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
  const passwordMatch = await bcrypt.compare(
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
  const access_token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });

  return {
    admin: {
      id: adminWithUsername.id,
      username: adminWithUsername.username,
      firstName: adminWithUsername.first_name,
      lastName: adminWithUsername.last_name,
      middleName: adminWithUsername.middle_name,
      email: adminWithUsername.email,
      role: adminWithUsername.role,
      createdAt: adminWithUsername.created_at,
      updatedAt: adminWithUsername.updated_at,
    },
    token: access_token,
  };
}

export async function fetchAdminDetails(id: string): Promise<AdminDetails> {
  const admin = await db
    .selectFrom("admin")
    .select([
      "id",
      "username",
      "first_name",
      "last_name",
      "middle_name",
      "email",
      "role",
      "created_at",
      "updated_at",
    ])
    .where("id", "=", id)
    .executeTakeFirst();

  if (!admin) {
    throw ApiError.unauthorized("Admin account no longer exists.");
  }

  // Transform snake_case database model to camelCase API DTO
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

export async function changeAdminUsername(
  id: string,
  newUsername: string,
): Promise<AdminDetails> {
  const conflict = await db
    .selectFrom("admin")
    .select(["id", "username"])
    .where((eb) => eb.or([eb("id", "=", id), eb("username", "=", newUsername)]))
    .execute();

  // console.log(conflict);

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

  // Transform snake_case database model to camelCase API DTO
  return {
    id: updatedAdmin.id,
    username: updatedAdmin.username,
    firstName: updatedAdmin.first_name,
    lastName: updatedAdmin.last_name,
    middleName: updatedAdmin.middle_name,
    email: updatedAdmin.email,
    role: updatedAdmin.role,
    createdAt: updatedAdmin.created_at,
    updatedAt: updatedAdmin.updated_at,
  };
}
