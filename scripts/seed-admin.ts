/**
 * Creates (or updates the password of) the single admin account.
 * Usage: ADMIN_EMAIL=you@studio.com ADMIN_PASSWORD=... DATABASE_URL=... npx tsx scripts/seed-admin.ts
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"] });
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const connectionString = process.env.DATABASE_URL;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
    process.exit(1);
  }
  if (!connectionString) {
    console.error("DATABASE_URL must be set.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `insert into admin_users (id, email, password_hash)
     values ($1, $2, $3)
     on conflict (email) do update set password_hash = excluded.password_hash`,
    [randomUUID(), email.toLowerCase().trim(), passwordHash]
  );

  console.log(`Admin account ready for ${email}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
