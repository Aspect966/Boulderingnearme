import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  const env = fs.readFileSync(envPath, "utf8");
  const token = env.match(/^SUPABASE_ACCESS_TOKEN=(.+)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
  if (!token) throw new Error("SUPABASE_ACCESS_TOKEN not found in .env.local");
  return token;
}

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error("Usage: node scripts/apply-migration.mjs <migration-file>");
  process.exit(1);
}

const token = loadEnv();
const sql = fs.readFileSync(path.join(root, migrationFile), "utf8");
const projectRef = "dxjgbiucqfhhymjfpzsq";

const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  }
);

const text = await response.text();
if (!response.ok) {
  console.error(`Migration failed (${response.status}):`, text);
  process.exit(1);
}

console.log("Migration applied successfully.");
if (text && text !== "[]") console.log(text);
