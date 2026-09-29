/**
 * Applies db/schema.sql against DATABASE_URL. Safe to re-run (uses IF NOT EXISTS).
 * Usage: DATABASE_URL=... npx tsx scripts/migrate.ts
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"] });
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL must be set.");
    process.exit(1);
  }

  const sql = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");
  const pool = new Pool({ connectionString });
  await pool.query(sql);
  console.log("Schema applied.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
