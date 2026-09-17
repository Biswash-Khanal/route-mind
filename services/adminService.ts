import {
  adminRegisterSchema,
  adminRegisterSchemaType,
} from "@/shared/schemas/adminRegisterSchema";
import { NextResponse } from "next/server";
import z from "zod";

import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/database";
import {
  conflictResponse,
  errorResponse,
  successResponse,
} from "@/utilities/apiResponse";
import { TursoDate } from "@/utilities/dateUtils";

export async function registerAdmin(
  data: adminRegisterSchemaType,
): Promise<NextResponse> {
  try {
    //check for unique username
    const duplicateUsername = await db
      .selectFrom("admin")
      .select("id")
      .where("username", "=", data.username)
      .executeTakeFirst();
    if (duplicateUsername) {
      return conflictResponse("username");
    }
    //check for unique email
    const duplicateEmail = await db
      .selectFrom("admin")
      .select("id")
      .where("email", "=", data.email)
      .executeTakeFirst();
    if (duplicateEmail) {
      return conflictResponse("email");
    }

    //no duplicates, continue

    //generate a random id
    const randomId = randomUUID();

    //hash the password, and replace the data shape password with the hashed value
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //create the final object to be inserted
    const enriched = {
      id: randomId,
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

    //insert to the database
    db.insertInto("admin").values(enriched).execute();

    return successResponse(
      { id: randomId, username: data.username },
      "Successfully created admin",
    );
  } catch (err) {
    console.error("DB error:", err); // raw log for dev/ops

    return errorResponse(err instanceof Error ? err.message : String(err), 500);
  }
}
