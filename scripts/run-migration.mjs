/**
 * Apply a single migration file.
 * Usage: node scripts/run-migration.mjs 002_owner_role.sql
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const envPath = resolve(projectRoot, ".env.local");
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

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-migration.mjs <filename.sql>");
  process.exit(1);
}

loadEnv();
const token = process.env.SUPABASE_ACCESS_TOKEN;
const sql = readFileSync(resolve(projectRoot, "supabase/migrations", file), "utf8");

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
if (!res.ok) {
  console.error(`Failed (${res.status}): ${text}`);
  process.exit(1);
}

console.log(`Applied ${file}`);
