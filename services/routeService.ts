import { randomUUID } from "crypto";
import { Selectable } from "kysely";

import { db } from "@/database";
import { Routes } from "@/database/types";
import { ApiError } from "@/shared/errors/apiError";
import {
  RouteCreateSchemaType,
  RouteUpdateSchemaType,
} from "@/shared/schemas/routeSchema";
import { RouteDetails } from "@/shared/types/route";
import { TursoDate } from "@/utilities/dateUtils";

function mapToRouteDetails(route: Selectable<Routes>): RouteDetails {
  return {
    id: route.id,
    name: route.name,
    operatorId: route.operator_id,
    fare: route.fare,
    createdAt: route.created_at,
    updatedAt: route.updated_at,
  };
}

/**
 * Resolves an operator id to its name, or rejects the request.
 *
 * `routes.operator_id` is a foreign key, so a bad id is a malformed request rather
 * than a missing route — hence 400, not 404. Returns the name so callers can build
 * a useful conflict message without a second query.
 */
async function fetchOperatorName(operatorId: string): Promise<string> {
  const operator = await db
    .selectFrom("operators")
    .select("name")
    .where("id", "=", operatorId)
    .executeTakeFirst();

  if (!operator) {
    throw ApiError.badRequest(`Operator ${operatorId} does not exist.`);
  }

  return operator.name;
}
//----------------------------------------------------------------------------------//
export async function createRoute(
  data: RouteCreateSchemaType,
): Promise<RouteDetails> {
  // 1. Foreign key check — the owning operator must exist.
  const operatorName = await fetchOperatorName(data.operatorId);

  // 2. Uniqueness is on the (name, operator) pair, not the name alone.
  const duplicateRoute = await db
    .selectFrom("routes")
    .select(["id"])
    .where((eb) =>
      eb.and([
        eb("name", "=", data.name),
        eb("operator_id", "=", data.operatorId),
      ]),
    )
    .executeTakeFirst();

  if (duplicateRoute) {
    throw ApiError.conflict(
      `Route name ${data.name} is already taken by operator ${operatorName}.`,
    );
  }

  // 3. Insert and return the raw inserted row in ONE query
  const id = randomUUID();
  const now = TursoDate.toTurso(new Date());

  const inserted = await db
    .insertInto("routes")
    .values({
      id,
      name: data.name,
      operator_id: data.operatorId,
      fare: data.fare,
      created_at: now,
      updated_at: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return mapToRouteDetails(inserted);
}
//----------------------------------------------------------------------------------//

export async function updateRoute(
  id: string,
  data: RouteUpdateSchemaType,
): Promise<RouteDetails> {
  // Step 1: Load the current row so a partial update is validated against the values
  // that will actually be stored, and so a missing route 404s before anything else.
  const currentRoute = await db
    .selectFrom("routes")
    .select(["id", "name", "operator_id"])
    .where("id", "=", id)
    .executeTakeFirst();

  if (!currentRoute) {
    throw ApiError.notFound("Route not found.");
  }

  // Step 2: Foreign key check, only when the operator is actually changing.
  if (data.operatorId !== undefined) {
    await fetchOperatorName(data.operatorId);
  }

  // Step 3: Resolve the pair, then check uniqueness on it. Skipped entirely when the
  // pair is unchanged, so editing only the fare never collides with the row's own
  // (name, operator) pair.
  const newName = data.name ?? currentRoute.name;
  const newOperatorId = data.operatorId ?? currentRoute.operator_id;

  if (
    newName !== currentRoute.name ||
    newOperatorId !== currentRoute.operator_id
  ) {
    const pairConflict = await db
      .selectFrom("routes")
      .select(["id"])
      .where((eb) =>
        eb.and([
          eb("name", "=", newName),
          eb("operator_id", "=", newOperatorId),
        ]),
      )
      .execute();

    if (pairConflict.some((route) => route.id !== id)) {
      throw ApiError.conflict(
        `Route name ${newName} is already taken by this operator.`,
      );
    }
  }

  // Step 4: Apply update. Kysely skips columns set to undefined, so a partial
  // update only touches the fields the caller actually sent.
  const now = TursoDate.toTurso(new Date());
  const updated = await db
    .updateTable("routes")
    .set({
      name: data.name,
      operator_id: data.operatorId,
      fare: data.fare,
      updated_at: now,
    })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return mapToRouteDetails(updated);
}

//----------------------------------------------------------------------------------//

/**
 * Refuses to delete a route that still has stops or shape points attached.
 *
 * Both are ON DELETE RESTRICT, so the database would refuse anyway; this check exists
 * to return a 409 that says how much is in the way. Shape points in particular are
 * hand-entered geometry and are expensive to recreate, so they are never dropped
 * silently. Skipped when the caller forces.
 */
async function assertRouteUnused(id: string, force: boolean): Promise<void> {
  if (force) return;

  const stopLinks = await db
    .selectFrom("route_stops")
    .select("id")
    .where("route_id", "=", id)
    .execute();

  if (stopLinks.length > 0) {
    throw ApiError.conflict(
      `Route is used by ${stopLinks.length} stop link(s) and cannot be deleted.`,
      {
        details: {
          dependents: [{ table: "route_stops", count: stopLinks.length }],
        },
      },
    );
  }

  const shapePoints = await db
    .selectFrom("route_shape_points")
    .select("id")
    .where("route_id", "=", id)
    .execute();

  if (shapePoints.length > 0) {
    throw ApiError.conflict(
      `Route has ${shapePoints.length} shape point(s) and cannot be deleted.`,
      {
        details: {
          dependents: [
            { table: "route_shape_points", count: shapePoints.length },
          ],
        },
      },
    );
  }
}

/**
 * Deletes a route.
 *
 * @param force when true, the route's stop links and shape points are removed first
 * (in a transaction) so a route that still has geometry can be deleted. Callers reach
 * this only from an explicit `?force=true`, after the user has confirmed the loss.
 */
export async function deleteRoute(
  id: string,
  force = false,
): Promise<RouteDetails> {
  const deletedRoute = await db
    .selectFrom("routes")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!deletedRoute) {
    throw ApiError.notFound(
      "The resource requested to be deleted was not found.",
    );
  }

  await assertRouteUnused(id, force);

  // With RESTRICT there is no cascade to lean on, so the children go first and the
  // whole thing has to be atomic.
  if (force) {
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom("route_stops").where("route_id", "=", id).execute();
      await trx
        .deleteFrom("route_shape_points")
        .where("route_id", "=", id)
        .execute();
      await trx.deleteFrom("routes").where("id", "=", id).execute();
    });

    return mapToRouteDetails(deletedRoute);
  }

  const deletedResult = await db
    .deleteFrom("routes")
    .where("id", "=", id)
    .executeTakeFirst();

  const deletedCount = Number(deletedResult.numDeletedRows);

  if (deletedCount === 0) {
    throw ApiError.notFound("Route to be deleted was not found.");
  }

  if (deletedCount > 1) {
    throw ApiError.internal("Unexpected: multiple routes deleted.");
  }

  return mapToRouteDetails(deletedRoute);
}

//----------------------------------------------------------------------------------//

/**
 * Reads every route.
 *
 * Routes carry no sensitive fields, so this backs the public `GET /api/routes`
 * endpoint as well as the admin dashboard's dropdowns — there is deliberately no
 * separate admin-only read path.
 */
export async function fetchAllRoutes(): Promise<RouteDetails[]> {
  const routes = await db.selectFrom("routes").selectAll().execute();

  return routes.map(mapToRouteDetails);
}

//----------------------------------------------------------------------------------//
