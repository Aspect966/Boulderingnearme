/**
 * One-time setup: creates the owner account via Supabase Auth.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local for auto-confirmed admin creation.
 * Falls back to public sign-up if only the publishable key is available.
 *
 * Usage: node scripts/create-owner.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const EMAIL = process.env.OWNER_EMAIL;
const PASSWORD = process.env.OWNER_PASSWORD;
const DISPLAY_NAME = process.env.OWNER_DISPLAY_NAME ?? "Owner";

if (!EMAIL || !PASSWORD) {
  console.error("Set OWNER_EMAIL and OWNER_PASSWORD environment variables.");
  process.exit(1);
}

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

async function createWithServiceRole() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: DISPLAY_NAME },
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    if (body.msg?.includes("already") || body.message?.includes("already")) {
      return { existing: true, user: body };
    }
    throw new Error(body.msg || body.message || JSON.stringify(body));
  }
  return { existing: false, user: body };
}

async function createWithSignUp() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
      data: { display_name: DISPLAY_NAME },
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.msg || body.error_description || JSON.stringify(body));
  }
  return body;
}

async function setOwnerRole(userId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ role: "owner", display_name: DISPLAY_NAME }),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(`Failed to set owner role: ${JSON.stringify(body)}`);
  }
}

async function main() {
  let userId;

  if (SERVICE_ROLE_KEY) {
    console.log("Creating user with service role (email auto-confirmed)...");
    const result = await createWithServiceRole();
    userId = result.user?.id ?? result.user?.user?.id;
    console.log(result.existing ? "User already exists." : "User created.");

    if (userId) {
      await setOwnerRole(userId);
      console.log("Owner role granted.");
    }
  } else {
    console.log("No SUPABASE_SERVICE_ROLE_KEY — using public sign-up...");
    const result = await createWithSignUp();
    userId = result.user?.id;
    console.log("Sign-up submitted.");
    console.log(
      "Run supabase/migrations/002_owner_role.sql in the SQL Editor to grant owner rights."
    );
    if (result.user?.identities?.length === 0) {
      console.log("Note: If email confirmation is enabled, check your inbox first.");
    }
  }

  console.log("\nAccount:");
  console.log(`  Name:  ${DISPLAY_NAME}`);
  console.log(`  Email: ${EMAIL}`);
  console.log(`  Role:  owner (after migration/service role step)`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
