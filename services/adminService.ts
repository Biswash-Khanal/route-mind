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

export interface CreatedAdmin {
  id: string;
  username: string;
}

/**
 * Registers a new admin.
 *
 * Rule of this layer: services throw `ApiError` tickets when something is
 * wrong and return plain data on success. They NEVER build HTTP responses —
 * the `withErrorHandling` wrapper in utilities/apiRoute converts thrown
 * tickets into responses. This keeps business logic framework-agnostic and
 * unit-testable.
 *
 * Flow: pre-check unique fields (fails fast with a clean conflict instead of
 * relying on a database constraint error) -> hash the password -> insert.
 */
export async function registerAdmin(
  data: adminRegisterSchemaType,
): Promise<CreatedAdmin> {
  // Unique username check — throw a labeled CONFLICT so the client gets a
  // clean 409 without a raw DB constraint error ever reaching the wrapper.
  const duplicateUsername = await db
    .selectFrom("admin")
    .select("id")
    .where("username", "=", data.username)
    .executeTakeFirst();
  if (duplicateUsername) {
    throw ApiError.conflict("Username already taken");
  }

  // Unique email check — same reasoning as username above.
  const duplicateEmail = await db
    .selectFrom("admin")
    .select("id")
    .where("email", "=", data.email)
    .executeTakeFirst();
  if (duplicateEmail) {
    throw ApiError.conflict("Email already registered");
  }

  // generate a random id
  const id = randomUUID();

  // hash the password; only the hash is ever stored
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // create the final row to insert
  const enriched = {
    id,
    first_name: data.firstName,
    last_name: data.lastName,
    middle_name: data.middleName ?? null,
    username: data.username,
    email: data.email,
    role: data.role,
    password_hash: hashedPassword,
    created_at: TursoDate.toTurso(new Date()),
    updated_at: TursoDate.toTurso(new Date()),
  };

  // Any genuine DB failure here (connection error, bug, ...) is unexpected
  // and will bubble up to the wrapper's catch-all -> logged -> generic 500.
  await db.insertInto("admin").values(enriched).execute();

  return { id, username: data.username };
}

export interface LoggedInAdmin {
  id: string;
  username: string;
  email: string;
  role: "admin" | "super-admin";
  createdAt: string;
  updatedAt: string;
}
export interface LoggedInAdminWithToken {
  admin: LoggedInAdmin;

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

  const payload = {
    id: adminWithUsername.id,
    username: adminWithUsername.username,
    email: adminWithUsername.email,
    role: adminWithUsername.role,
    createdAt: adminWithUsername.created_at,
    updatedAt: adminWithUsername.updated_at,
  };

  //generate an access token
  const access_token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "10s",
  });

  return { admin: { ...payload }, token: access_token };
}

export interface AdminDetails {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string;
  role: "admin" | "super-admin";
  createdAt: string;
  updatedAt: string;
}

export async function fetchAdminDetails(token: string): Promise<AdminDetails> {
  //This function throws error automatically if failure during decoding
  const decoded: LoggedInAdmin = jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
  ) as LoggedInAdmin;

  const id = decoded.id;

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
