import { Kysely, sql } from "kysely";


export async function up(db: Kysely<any>): Promise<void> {
  // 1. Create Tables
  await db.schema
    .createTable("stops")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("latitude", "real", (col) => col.notNull())
    .addColumn("longitude", "real", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addUniqueConstraint("name_latitude_longitude_unique", [
      "name",
      "latitude",
      "longitude",
    ])
    .execute();

  await db.schema
    .createTable("routes")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("operator", "text", (col) => col.notNull())
    .addColumn("fare", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addUniqueConstraint("name_operator_unique", ["name", "operator"])
    .execute();

  await db.schema
    .createTable("route_stops")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("route_id", "uuid", (col) =>
      col.references("routes.id").onDelete("cascade"),
    )
    .addColumn("stop_id", "uuid", (col) =>
      col.references("stops.id").onDelete("cascade"),
    )
    .addColumn("sequence", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addUniqueConstraint("route_id_stop_id_unique", [
      "route_id",
      "stop_id",
      "sequence",
    ])
    .execute();

  await db.schema
    .createTable("route_shape_points")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("route_id", "uuid", (col) =>
      col.references("routes.id").onDelete("cascade"),
    )
    .addColumn("sequence", "integer", (col) => col.notNull())
    .addColumn("latitude", "real", (col) => col.notNull())
    .addColumn("longitude", "real", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addUniqueConstraint("route_id_sequence_unique", [
      "route_id",
      "sequence",
    ])
    .execute();


}

export async function down(db: Kysely<any>): Promise<void> {


  // 2. Drop Tables in Reverse Order of Foreign Key Dependencies
  await db.schema.dropTable("route_shape_points").execute();
  await db.schema.dropTable("route_stops").execute();
  await db.schema.dropTable("routes").execute();
  await db.schema.dropTable("stops").execute();
}