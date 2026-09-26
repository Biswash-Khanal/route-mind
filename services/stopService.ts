import { randomUUID } from "crypto";
import { Selectable } from "kysely";

import { db } from "@/database";
import { Stops } from "@/database/types";
import { ApiError } from "@/shared/errors/apiError";
import {
  StopCreateSchemaType,
  StopUpdateSchemaType,
} from "@/shared/schemas/stopSchema";
import { StopDetails } from "@/shared/types/stop";
import { TursoDate } from "@/utilities/dateUtils";

function mapToStopDetails(stop: Selectable<Stops>): StopDetails {
  return {
    id: stop.id,
    name: stop.name,
    latitude: stop.latitude,
    longitude: stop.longitude,
    createdAt: stop.created_at,
    updatedAt: stop.updated_at,
  };
}

/**
 * Refuses to delete a stop that routes still link to.
 *
 * A stop is a reusable location, so deleting one that is in use would silently
 * remove it from every route referencing it. `route_stops.stop_id` is ON DELETE
 * RESTRICT, so the database would refuse anyway; this check exists to return a 409
 * that says how many links are in the way. Skipped when the caller forces.
 */
async function assertStopUnlinked(id: string, force: boolean): Promise<void> {
  if (force) return;

  const links = await db
    .selectFrom("route_stops")
    .select("id")
    .where("stop_id", "=", id)
    .execute();

  if (links.length > 0) {
    throw ApiError.conflict(
      `Stop is used by ${links.length} route link(s) and cannot be deleted.`,
      {
        details: { dependents: [{ table: "route_stops", count: links.length }] },
      },
    );
  }
}
//----------------------------------------------------------------------------------//
export async function createStop(
  data: StopCreateSchemaType,
): Promise<StopDetails> {
  // 1. Uniqueness is on the (name, latitude, longitude) triple, so the same stop
  // name may exist at different coordinates but never twice at the same spot.
  const duplicateStop = await db
    .selectFrom("stops")
    .select(["id"])
    .where((eb) =>
      eb.and([
        eb("name", "=", data.name),
        eb("latitude", "=", data.latitude),
        eb("longitude", "=", data.longitude),
      ]),
    )
    .executeTakeFirst();

  if (duplicateStop) {
    throw ApiError.conflict(
      `Stop ${data.name} already exists at these coordinates.`,
    );
  }

  // 2. Insert and return the raw inserted row in ONE query
  const id = randomUUID();
  const now = TursoDate.toTurso(new Date());

  const inserted = await db
    .insertInto("stops")
    .values({
      id,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      created_at: now,
      updated_at: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return mapToStopDetails(inserted);
}
//----------------------------------------------------------------------------------//

export async function updateStop(
  id: string,
  data: StopUpdateSchemaType,
): Promise<StopDetails> {
  // Step 1: Load the current row so a partial update is validated against the values
  // that will actually be stored, and so a missing stop 404s before anything else.
  const currentStop = await db
    .selectFrom("stops")
    .select(["id", "name", "latitude", "longitude"])
    .where("id", "=", id)
    .executeTakeFirst();

  if (!currentStop) {
    throw ApiError.notFound("Stop not found.");
  }

  // Step 2: Resolve the triple, then check uniqueness on it. Skipped when the triple
  // is unchanged, so renaming a stop to the name it already has cannot self-collide.
  const newName = data.name ?? currentStop.name;
  const newLatitude = data.latitude ?? currentStop.latitude;
  const newLongitude = data.longitude ?? currentStop.longitude;

  if (
    newName !== currentStop.name ||
    newLatitude !== currentStop.latitude ||
    newLongitude !== currentStop.longitude
  ) {
    const tripleConflict = await db
      .selectFrom("stops")
      .select(["id"])
      .where((eb) =>
        eb.and([
          eb("name", "=", newName),
          eb("latitude", "=", newLatitude),
          eb("longitude", "=", newLongitude),
        ]),
      )
      .execute();

    if (tripleConflict.some((stop) => stop.id !== id)) {
      throw ApiError.conflict(
        `Stop ${newName} already exists at these coordinates.`,
      );
    }
  }

  // Step 3: Apply update. Kysely skips columns set to undefined, so a partial
  // update only touches the fields the caller actually sent.
  const now = TursoDate.toTurso(new Date());
  const updated = await db
    .updateTable("stops")
    .set({
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      updated_at: now,
    })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return mapToStopDetails(updated);
}

//----------------------------------------------------------------------------------//

/**
 * Deletes a stop.
 *
 * @param force when true, the route links are removed first (in a transaction) so a
 * stop that is genuinely in use can still be deleted. Callers reach this only from an
 * explicit `?force=true`, after the user has confirmed the data loss.
 */
export async function deleteStop(
  id: string,
  force = false,
): Promise<StopDetails> {
  const deletedStop = await db
    .selectFrom("stops")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!deletedStop) {
    throw ApiError.notFound(
      "The resource requested to be deleted was not found.",
    );
  }

  await assertStopUnlinked(id, force);

  // With RESTRICT there is no cascade to lean on, so removing the links is explicit
  // and has to be atomic with the stop deletion.
  if (force) {
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom("route_stops").where("stop_id", "=", id).execute();
      await trx.deleteFrom("stops").where("id", "=", id).execute();
    });

    return mapToStopDetails(deletedStop);
  }

  const deletedResult = await db
    .deleteFrom("stops")
    .where("id", "=", id)
    .executeTakeFirst();

  const deletedCount = Number(deletedResult.numDeletedRows);

  if (deletedCount === 0) {
    throw ApiError.notFound("Stop to be deleted was not found.");
  }

  if (deletedCount > 1) {
    throw ApiError.internal("Unexpected: multiple stops deleted.");
  }

  return mapToStopDetails(deletedStop);
}

//----------------------------------------------------------------------------------//

/**
 * Reads every stop.
 *
 * Stops carry no sensitive fields, so this backs the public `GET /api/stops`
 * endpoint as well as the admin dashboard's dropdowns — there is deliberately no
 * separate admin-only read path.
 */
export async function fetchAllStops(): Promise<StopDetails[]> {
  const stops = await db.selectFrom("stops").selectAll().execute();

  return stops.map(mapToStopDetails);
}

//----------------------------------------------------------------------------------//
