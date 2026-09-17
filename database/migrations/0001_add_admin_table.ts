import { Kysely, sql } from "kysely";

export async function up(db:Kysely<any>):Promise<void>{
    await db.schema.createTable("admin")
    .addColumn("id", "uuid", (col)=>col.primaryKey())
    .addColumn("first_name", "text", (col)=>col.notNull() )
    .addColumn("last_name", "text",(col)=>col.notNull() )
    .addColumn("middle_name", "text" )
    .addColumn("username", "text", (col)=>col.unique().notNull() )
    .addColumn("email", "text", (col)=>col.unique().notNull())
    .addColumn("password_hash","text", (col)=>col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("role", "text", (col)=>col.notNull().defaultTo("admin").check(sql`role IN ('super-admin', 'admin')`))
    .execute();
}
export async function down(db:Kysely<any>):Promise<void>{
    await db.schema.dropTable("admin").execute();
}