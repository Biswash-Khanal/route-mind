import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Kysely's `Migration` interface takes `Kysely<any>` by design, so migration files stay independent of the evolving `DB` interface in `database/types.ts`. A codegen change must never be able to invalidate a migration.
export async function up(db: Kysely<any>): Promise<void> {
  // Operators table (normalized company info)
  await db.schema
    .createTable("operators")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("address", "text")
    .addColumn("contact_email", "text")
    .addColumn("contact_phone", "text")
    .addColumn("website_url", "text")
    .addColumn("license_number", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addUniqueConstraint("name_unique", ["name"])
    .addUniqueConstraint("license_number_unique", ["license_number"])
    .execute();

  // Admin table
  await db.schema
    .createTable("admin")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("middle_name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("username", "text", (col) => col.unique().notNull())
    .addColumn("password_hash", "text", (col) => col.notNull())
    .addColumn("role", "text", (col) =>
      col.notNull().check(sql`role IN ('super-admin', 'admin')`),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // Stops table
  await db.schema
    .createTable("stops")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("latitude", "real", (col) => col.notNull())
    .addColumn("longitude", "real", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addUniqueConstraint("name_latitude_longitude_unique", [
      "name",
      "latitude",
      "longitude",
    ])
    .execute();

  // Routes table (operator_id instead of operator string)
  await db.schema
    .createTable("routes")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    // RESTRICT, not CASCADE: deleting an operator must never silently take its
    // routes (and transitively their stops/shape points) with it. The delete
    // endpoints refuse with 409 while dependents exist, and only remove the whole
    // tree when explicitly called with ?force=true.
    .addColumn("operator_id", "uuid", (col) =>
      col.references("operators.id").onDelete("restrict").notNull(),
    )
    // "real" is the explicit spelling of SQLite/Turso's REAL affinity, which is what
    // we want for a decimal fare. Do NOT use "decimal"/"numeric" here: those get
    // NUMERIC affinity, which silently stores 3.0 as an integer and only keeps a
    // REAL when the value has a fractional part.
    .addColumn("fare", "real", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addUniqueConstraint("name_operator_unique", ["name", "operator_id"])
    .execute();

  // Route stops table
  await db.schema
    .createTable("route_stops")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("route_id", "uuid", (col) =>
      col.references("routes.id").onDelete("restrict"),
    )
    .addColumn("stop_id", "uuid", (col) =>
      col.references("stops.id").onDelete("restrict"),
    )
    .addColumn("sequence", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addUniqueConstraint("route_id_stop_id_sequence_unique", [
      "route_id",
      "stop_id",
      "sequence",
    ])
    .execute();

  // Route shape points table
  await db.schema
    .createTable("route_shape_points")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("route_id", "uuid", (col) =>
      col.references("routes.id").onDelete("restrict"),
    )
    .addColumn("sequence", "integer", (col) => col.notNull())
    .addColumn("latitude", "real", (col) => col.notNull())
    .addColumn("longitude", "real", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addUniqueConstraint("route_id_sequence_unique", ["route_id", "sequence"])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see the note on `up` above.
export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse dependency order
  await db.schema.dropTable("route_shape_points").execute();
  await db.schema.dropTable("route_stops").execute();
  await db.schema.dropTable("routes").execute();
  await db.schema.dropTable("stops").execute();
  await db.schema.dropTable("admin").execute();
  await db.schema.dropTable("operators").execute();
}
