// database/scripts/seed.ts
import { seedSuperAdmin } from "./seeds/super_admin";

async function main() {
  const target = process.argv[2] || "all"; // default to all seeds
  console.log(`🌱 Seeding script started [target=${target}]`);

  if (target === "super-admin" || target === "all") {
    await seedSuperAdmin();
  }

  console.log("✅ Seeding finished");
  await import("../../database/index").then(({ db }) => db.destroy());
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});