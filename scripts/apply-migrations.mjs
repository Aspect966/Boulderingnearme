/**
 * Applies SQL migrations via Supabase Management API.
 * Requires SUPABASE_ACCESS_TOKEN in .env.local
 *
 * Usage: node scripts/apply-migrations.mjs
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const envPath = resolve(projectRoot, ".env.local");
const migrationsDir = resolve(projectRoot, "supabase/migrations");
const PROJECT_REF = "dxjgbiucqfhhymjfpzsq";

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && value && !process.env[key]) process.env[key] = value;
  }
}

async function runSql(token, sql, label) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!res.ok) {
    throw new Error(`${label} failed (${res.status}): ${JSON.stringify(body)}`);
  }

  console.log(`✓ ${label}`);
  return body;
}

async function main() {
  loadEnv();
  const token = process.env.SUPABASE_ACCESS_TOKEN;

  if (!token) {
    console.error("Missing SUPABASE_ACCESS_TOKEN in .env.local");
    console.error("Create one at https://supabase.com/dashboard/account/tokens");
    process.exit(1);
  }

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.error("No migration files found.");
    process.exit(1);
  }

  console.log(`Applying ${files.length} migration(s) to ${PROJECT_REF}...\n`);

  for (const file of files) {
    const sql = readFileSync(resolve(migrationsDir, file), "utf8");
    await runSql(token, sql, file);
  }

  console.log("\nAll migrations applied.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
