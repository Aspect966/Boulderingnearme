/**
 * Run a single SQL query via Supabase Management API.
 * Usage: node scripts/supabase-query.mjs "SELECT 1"
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

async function runSql(sql) {
  loadEnv();
  const token = process.env.SUPABASE_ACCESS_TOKEN;
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
  if (!res.ok) throw new Error(`${res.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const sql = process.argv[2];
if (!sql) {
  console.error("Usage: node scripts/supabase-query.mjs \"SELECT ...\"");
  process.exit(1);
}

runSql(sql)
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
