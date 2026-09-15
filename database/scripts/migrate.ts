// database/scripts/migrate.ts
import { promises as fs } from "fs";
import path from "path";

import { FileMigrationProvider, Migrator } from "kysely/migration";
import { db } from "../index"; // adjust if needed


async function main() {
  const direction = process.argv[2] || "up"; // default is migrate up
  console.log(`🚀 Migration script started [${direction}]`);
  console.log("Looking for migrations in:", path.join(__dirname, "../migrations"));

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "../migrations"),
    }),
  });

  let result;
  if (direction === "down") {
    result = await migrator.migrateDown();
  } else {
    result = await migrator.migrateToLatest();
  }

  const { error, results } = result;

  if (results && results.length > 0) {
    console.log("📜 Results:");
    for (const r of results) {
      console.log(`- ${r.migrationName}: ${r.status}`);
    }
  } else {
    console.log("⚠️ No migrations executed.");
  }

  if (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }

  console.log("✅ Migration finished.");
  await db.destroy();
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
