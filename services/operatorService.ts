import { db } from "@/database";
import { Operators } from "@/database/types";
import { ApiError } from "@/shared/errors/apiError";
import {
  OperatorCreateSchemaType,
  OperatorUpdateSchemaType,
} from "@/shared/schemas/operatorSchema";
import { OperatorDetails } from "@/shared/types/operator";
import { TursoDate } from "@/utilities/dateUtils";
import { randomUUID } from "crypto";
import { Selectable } from "kysely";

function mapToOperatorDetails(
  operator: Selectable<Operators>,
): OperatorDetails {
  return {
    id: operator.id,
    name: operator.name,
    address: operator.address,
    contactEmail: operator.contact_email,
    contactPhone: operator.contact_phone,
    websiteUrl: operator.website_url,
    licenseNumber: operator.license_number,
    createdAt: operator.created_at,
    updatedAt: operator.updated_at,
  };
}
//----------------------------------------------------------------------------------//
export async function createOperator(
  data: OperatorCreateSchemaType,
): Promise<OperatorDetails> {
  // 1. Unique checks...
  const duplicateOperatorName = await db
    .selectFrom("operators")
    .select(["id"])
    .where("name", "=", data.name)
    .executeTakeFirst();

  if (duplicateOperatorName) {
    throw ApiError.conflict(`Operator name ${data.name} is already taken.`);
  }

  if (data.licenseNumber) {
    const duplicateOperatorLicenseNumber = await db
      .selectFrom("operators")
      .select(["id"])
      .where("license_number", "=", data.licenseNumber)
      .executeTakeFirst();

    if (duplicateOperatorLicenseNumber) {
      throw ApiError.conflict(
        `License number ${data.licenseNumber} is already taken.`,
      );
    }
  }

  // 2. Hash & prepare fields
  const id = randomUUID();
  const now = TursoDate.toTurso(new Date());

  // 3. Insert and return the raw inserted row in ONE query
  const inserted = await db
    .insertInto("operators")
    .values({
      id,
      name: data.name,
      address: data.address,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      website_url: data.websiteUrl,
      license_number: data.licenseNumber,
      created_at: now,
      updated_at: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return mapToOperatorDetails(inserted);
}
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
export async function updateOperator(
  id: string,
  data: OperatorUpdateSchemaType,
): Promise<OperatorDetails> {
  //do the unique checks
  //Both checks select the target row alongside any row holding the incoming value,
  //so that renaming an operator to the name/license number it already owns is
  //reported as a no-op conflict instead of colliding with itself.
  if (data.name !== undefined) {
    const newName = data.name;

    const nameConflict = await db
      .selectFrom("operators")
      .select(["id", "name"])
      .where((eb) => eb.or([eb("id", "=", id), eb("name", "=", newName)]))
      .execute();

    const currentOperator = nameConflict.find(
      (operator) => operator.id === id,
    );

    if (!currentOperator) {
      throw ApiError.notFound("Operator not found.");
    }

    if (currentOperator.name === newName) {
      throw ApiError.conflict("Cannot change name to what it already is.");
    }

    if (nameConflict.some((operator) => operator.id !== id)) {
      throw ApiError.conflict(`Operator name ${newName} is already taken.`);
    }
  }

  if (data.licenseNumber !== undefined) {
    const newLicenseNumber = data.licenseNumber;

    const licenseConflict = await db
      .selectFrom("operators")
      .select(["id", "license_number"])
      .where((eb) =>
        eb.or([
          eb("id", "=", id),
          eb("license_number", "=", newLicenseNumber),
        ]),
      )
      .execute();

    const currentOperator = licenseConflict.find(
      (operator) => operator.id === id,
    );

    if (!currentOperator) {
      throw ApiError.notFound("Operator not found.");
    }

    if (currentOperator.license_number === newLicenseNumber) {
      throw ApiError.conflict(
        "Cannot change license number to what it already is.",
      );
    }

    if (licenseConflict.some((operator) => operator.id !== id)) {
      throw ApiError.conflict(
        `License number ${newLicenseNumber} is already taken.`,
      );
    }
  }

  const now = TursoDate.toTurso(new Date());
  const updated = await db
    .updateTable("operators")
    .set({
      name: data.name,
      address: data.address,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      website_url: data.websiteUrl,
      license_number: data.licenseNumber,
      updated_at: now,
    })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!updated) throw ApiError.notFound("Operator not found.");

  return mapToOperatorDetails(updated);
}

/**
 * Refuses to delete an operator that still owns routes.
 *
 * `routes.operator_id` is ON DELETE RESTRICT, so the database would refuse anyway;
 * this check exists to return a 409 that says how many routes are in the way. Note
 * the count is only the direct dependents — force-deleting an operator also takes
 * those routes' stop links and shape points with it. Skipped when the caller forces.
 */
async function assertOperatorHasNoRoutes(
  id: string,
  force: boolean,
): Promise<void> {
  if (force) return;

  const routes = await db
    .selectFrom("routes")
    .select("id")
    .where("operator_id", "=", id)
    .execute();

  if (routes.length > 0) {
    throw ApiError.conflict(
      `Operator still owns ${routes.length} route(s) and cannot be deleted.`,
      {
        details: { dependents: [{ table: "routes", count: routes.length }] },
      },
    );
  }
}

/**
 * Deletes an operator.
 *
 * @param force when true, the operator's routes are removed first — along with their
 * stop links and shape points — so an operator that still owns routes can be deleted.
 * Callers reach this only from an explicit `?force=true`, after the user has confirmed
 * the loss.
 */
export async function deleteOperator(
  id: string,
  force = false,
): Promise<OperatorDetails> {
  const deletedOperator = await db
    .selectFrom("operators")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!deletedOperator) {
    throw ApiError.notFound(
      "The resource requested to be deleted was not found.",
    );
  }

  await assertOperatorHasNoRoutes(id, force);

  // With RESTRICT there is no cascade to lean on. Deleting an operator reaches two
  // levels down, so the whole tree has to go in one transaction.
  if (force) {
    await db.transaction().execute(async (trx) => {
      const ownedRoutes = await trx
        .selectFrom("routes")
        .select("id")
        .where("operator_id", "=", id)
        .execute();

      const routeIds = ownedRoutes.map((route) => route.id);

      if (routeIds.length > 0) {
        await trx
          .deleteFrom("route_stops")
          .where("route_id", "in", routeIds)
          .execute();
        await trx
          .deleteFrom("route_shape_points")
          .where("route_id", "in", routeIds)
          .execute();
        await trx.deleteFrom("routes").where("operator_id", "=", id).execute();
      }

      await trx.deleteFrom("operators").where("id", "=", id).execute();
    });

    return mapToOperatorDetails(deletedOperator);
  }

  const deletedResult = await db
    .deleteFrom("operators")
    .where("id", "=", id)
    .executeTakeFirst();

  const deletedCount = Number(deletedResult.numDeletedRows);

  if (deletedCount === 0) {
    throw ApiError.notFound("Operator to be deleted was not found.");
  }

  if (deletedCount > 1) {
    throw ApiError.internal("Unexpected: multiple operators deleted.");
  }
  return mapToOperatorDetails(deletedOperator);
}

//----------------------------------------------------------------------------------//

/**
 * Reads every operator.
 *
 * Operators carry no sensitive fields, so this backs the public `GET /api/operators`
 * endpoint as well as the admin dashboard's dropdowns — there is deliberately no
 * separate admin-only read path.
 */
export async function fetchAllOperators(): Promise<OperatorDetails[]> {
  const operators = await db.selectFrom("operators").selectAll().execute();

  return operators.map(mapToOperatorDetails);
}

//----------------------------------------------------------------------------------//
