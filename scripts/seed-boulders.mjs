/**
 * Seed outdoor boulders near Orchard Park, NY with real data and photos.
 * Sources: Mountain Project, theCrag, Topout guide, Wikimedia Commons (CC BY 2.0).
 *
 * Usage: node scripts/seed-boulders.mjs
 *
 * Optional env (.env.local):
 *   SUPABASE_ACCESS_TOKEN — used for Management API SQL inserts
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const envPath = resolve(projectRoot, ".env.local");
const PROJECT_REF = "dxjgbiucqfhhymjfpzsq";

const OWNER_USER_ID = "3d91ea82-f829-487f-bc70-dd4980ee43f0";

/** Real boulders within ~40 miles of Orchard Park, NY (42.768, -78.744) */
const BOULDER_SEED_DATA = [
  {
    name: "Life O'Reilly",
    location_label: "Niagara Glen Central Area, Niagara Falls, ON (~30 mi from Orchard Park)",
    latitude: 43.12893,
    longitude: -79.05743,
    grade_label: "V6",
    v_equivalent: 6,
    description:
      "Classic arête problem on the Danzig Boulder in Niagara Glen's Central Area. Stand start on the blank wall behind No U-Turn and work through delicate movements to the top out. Rated V6 with a V7 sit-start variant (Life O'Reilly Sit). Frequently cited as a must-do at the Glen. Permits required from Niagara Parks ($40/yr includes parking). Spring and fall offer the best conditions on polished dolomite.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Bouldering_at_Niagara_Glen_%2822181703525%29.jpg/1280px-Bouldering_at_Niagara_Glen_%2822181703525%29.jpg",
    photoCredit: "Larry Koester / Wikimedia Commons (CC BY 2.0)",
    source: "https://www.thecrag.com/en/climbing/canada/niagara-glen/area/11920279",
  },
  {
    name: "No U-Turn",
    location_label: "Danzig Boulder, Niagara Glen, Niagara Falls, ON (~30 mi)",
    latitude: 43.12898,
    longitude: -79.05755,
    grade_label: "V3",
    v_equivalent: 3,
    description:
      "Stand start on the good edge on the Danzig Boulder, beta-dependent climbing to a pinch at the sharp V-shaped hold, then up and right to jugs at the top. A Niagara Glen veteran once called it the 'hardest V3 in the world' — polished dolomite and tricky feet make it feel stiffer than the grade suggests. 2-star classic in the Central Area collection above Wonderland.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Bouldering_at_Niagara_Glen_%2821560690423%29.jpg/1280px-Bouldering_at_Niagara_Glen_%2821560690423%29.jpg",
    photoCredit: "Larry Koester / Wikimedia Commons (CC BY 2.0)",
    source: "https://www.thecrag.com/en/climbing/canada/niagara-glen/area/11920279",
  },
  {
    name: "Captain's Corner",
    location_label: "Little Rock City, Rock City State Forest, Little Valley, NY (~39 mi)",
    latitude: 42.20892,
    longitude: -78.7075,
    grade_label: "V1",
    v_equivalent: 1,
    description:
      "One of the most popular problems at Little Rock City — a 50-acre bouldering zone in Rock City and McCarty Hill State Forest near Ellicottville. Conglomerate rock with problems from V0+ to V6 on boulders ranging from 1–12 m tall. Approach via Whig St and Hungry Hollow Rd to Little Rock City Rd parking loop. Free public access; no permit required.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg/1280px-Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg",
    photoCredit: "Andre Carrotflower / Wikimedia Commons (CC BY-SA 4.0) — Cattaraugus County rock city boulders",
    source: "https://www.mountainproject.com/area/127016603/little-rock-city",
  },
  {
    name: "Over the Top",
    location_label: "Little Rock City, Rock City State Forest, NY (~39 mi)",
    latitude: 42.2091,
    longitude: -78.7076,
    grade_label: "V2",
    v_equivalent: 2,
    description:
      "Highly rated V2 at Little Rock City with six stars on Mountain Project. A classic line on the Over the Top Boulder in the main boulder field. The area features hundreds of documented and undocumented problems on Devonian-age conglomerate formations formed by Alleghenian orogeny uplift and erosion. Best visited spring through fall.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg/1280px-Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg",
    photoCredit: "Andre Carrotflower / Wikimedia Commons (CC BY-SA 4.0) — Cattaraugus County rock city boulders",
    source: "https://www.mountainproject.com/area/127016603/little-rock-city",
  },
  {
    name: "Flexus Dyrexus",
    location_label: "Little Rock City, Rock City State Forest, NY (~39 mi)",
    latitude: 42.2093,
    longitude: -78.708,
    grade_label: "V6",
    v_equivalent: 6,
    description:
      "The hardest established problem in the Little Rock City boulder field at V6 (Font 7A). Nine stars on Mountain Project make it the area testpiece. Long, powerful climbing on featured conglomerate. Many undocumented lines remain in the Rim Trail and Rock City zones nearby. North Country Trail passes through the state forest.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg/1280px-Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg",
    photoCredit: "Andre Carrotflower / Wikimedia Commons (CC BY-SA 4.0) — Cattaraugus County rock city boulders",
    source: "https://www.mountainproject.com/area/127016603/little-rock-city",
  },
  {
    name: "Terra Ferra",
    location_label: "Little Rock City, Rock City State Forest, NY (~39 mi)",
    latitude: 42.2087,
    longitude: -78.7082,
    grade_label: "V5",
    v_equivalent: 5,
    description:
      "V4+ (Font 6B+) classic on the Terra Ferra Boulder — four stars on Mountain Project. Steeper conglomerate climbing in the heart of the main boulder cluster. Little Rock City sits at ~2,278 ft elevation in Cattaraugus County, roughly 115 miles / 2 hr 15 min from Rochester and ~39 miles south of Orchard Park.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg/1280px-Thunder_Rocks%2C_Allegany_State_Park_-_20210921_-_09.jpg",
    photoCredit: "Andre Carrotflower / Wikimedia Commons (CC BY-SA 4.0) — Cattaraugus County rock city boulders",
    source: "https://www.mountainproject.com/area/127016603/little-rock-city",
  },
  {
    name: "Birth Canal",
    location_label: "Deiters Rock, Niagara River, Niagara Glen, ON (~30 mi)",
    latitude: 43.1085,
    longitude: -79.067,
    grade_label: "V1",
    v_equivalent: 1,
    description:
      "One of four recorded lines on Deiters Rock, a short cliff of high-quality limestone beside the Niagara River. Named in memory of Deiter, who helped establish the area's first ascents. Approach ~20 minutes upriver from the Whirlpool on escarpment-side trails — no trail follows the river base. Watch river levels; landings can flood. V1 warm-up before harder neighbors like Wish You Were Here (V4) and Aquawoman (V4).",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Bouldering_at_Niagara_Glen_%2822181703525%29.jpg/1280px-Bouldering_at_Niagara_Glen_%2822181703525%29.jpg",
    photoCredit: "Larry Koester / Wikimedia Commons (CC BY 2.0)",
    source: "https://www.mountainproject.com/climbing-near-me/orchard-park-ny",
  },
  {
    name: "Pistol Pete",
    location_label: "Niagara Glen Downstairs, Niagara Falls, ON (~30 mi)",
    latitude: 43.1285,
    longitude: -79.058,
    grade_label: "V2",
    v_equivalent: 2,
    description:
      "Roof problem in the Downstairs sector sharing a start with Yosemite Sam (V1). Exit the roof further right on dusty holds to a top out — not much harder than its neighbor but with a distinct finish. Part of the extensive Downstairs collection that includes Ben and Jerry (V2) and Crimp De La Crimp (V5). 2-star classic in the Ontario bouldering guidebook.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Bouldering_at_Niagara_Glen_%2821560690423%29.jpg/1280px-Bouldering_at_Niagara_Glen_%2821560690423%29.jpg",
    photoCredit: "Larry Koester / Wikimedia Commons (CC BY 2.0)",
    source: "https://www.thecrag.com/en/climbing/canada/niagara-glen/area/11920279",
  },
  {
    name: "Caz Creek Lowballs",
    location_label: "Kissing Bridge / Cazenovia Creek, Glenwood, NY (~13 mi)",
    latitude: 42.59761,
    longitude: -78.65196,
    grade_label: "V1",
    v_equivalent: 1,
    description:
      "Lowball boulders along Cazenovia Creek near Kissing Bridge Ski Resort — the closest outdoor rock to Orchard Park. Rocks are ≤7 ft tall, remnants of old dam foundations used for snowmaking water. Not a destination crag, but a quick walk from the rails-to-trails path upstream from the resort parking lot. For serious climbing, head 30 mi to Niagara Glen or 39 mi to Little Rock City. Also explore Sprague Brook Park nearby for hiking and MTB.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Rapids_on_Cazenovia_Creek_as_seen_from_Quaker_Road_bridge%2C_Aurora%2C_New_York_-_20230216.jpg/1280px-Rapids_on_Cazenovia_Creek_as_seen_from_Quaker_Road_bridge%2C_Aurora%2C_New_York_-_20230216.jpg",
    photoCredit: "Andre Carrotflower / Wikimedia Commons (CC BY-SA 4.0)",
    source: "https://www.mountainproject.com/area/127349182/kissing-bridge",
  },
  {
    name: "Crimp De La Crimp",
    location_label: "Niagara Glen Downstairs, Niagara Falls, ON (~30 mi)",
    latitude: 43.1284,
    longitude: -79.0578,
    grade_label: "V5",
    v_equivalent: 5,
    description:
      "Technical crimp line in the Downstairs sector. The original start hold broke in 2020; the problem now begins on the next jug rail and climbs through thin crimps. Do not top out — moss covers the finish. A V5 benchmark at the Glen on polished dolomite. Over 700 established problems exist in Niagara Glen, Southern Ontario's largest bouldering area. Annual bouldering permit required.",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Bouldering_at_Niagara_Glen_%2822181703525%29.jpg/1280px-Bouldering_at_Niagara_Glen_%2822181703525%29.jpg",
    photoCredit: "Larry Koester / Wikimedia Commons (CC BY 2.0)",
    source: "https://www.thecrag.com/en/climbing/canada/niagara-glen/area/11920279",
  },
];

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
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error("Missing SUPABASE_ACCESS_TOKEN in .env.local");

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
  if (!res.ok) throw new Error(`SQL failed (${res.status}): ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

async function downloadPhoto(url) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "BoulderingNearMe-SeedScript/1.0 (educational; contact: local-dev)",
      },
    });
    if (res.status === 429 && attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`Photo download failed (${res.status}): ${url}`);
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error(`Photo exceeds 5 MB: ${url}`);
    }
    return { buffer, contentType };
  }
  throw new Error(`Photo download failed after retries: ${url}`);
}

async function attachPhotoUrl(userId, boulderId, photoUrl) {
  await runSql(`
    INSERT INTO public.boulder_photos (boulder_id, storage_path, user_id, is_thumbnail)
    VALUES ('${boulderId}', '${escapeSql(photoUrl)}', '${userId}', true);
  `);
  return photoUrl;
}

async function insertBoulder(entry) {
  const result = await runSql(`
    INSERT INTO public.boulders (
      name, description, latitude, longitude, location_label,
      primary_scale, consensus_v_grade, created_by
    ) VALUES (
      '${escapeSql(entry.name)}',
      '${escapeSql(entry.description)}',
      ${entry.latitude},
      ${entry.longitude},
      '${escapeSql(entry.location_label)}',
      'v_scale',
      ${entry.v_equivalent},
      '${OWNER_USER_ID}'
    )
    RETURNING id;
  `);

  const boulderId = result?.[0]?.id;
  if (!boulderId) throw new Error(`Failed to insert boulder: ${entry.name}`);

  await runSql(`
    INSERT INTO public.difficulty_ratings (boulder_id, user_id, scale, grade_label, v_equivalent)
    VALUES ('${boulderId}', '${OWNER_USER_ID}', 'v_scale', '${escapeSql(entry.grade_label)}', ${entry.v_equivalent})
    ON CONFLICT (boulder_id, user_id) DO NOTHING;
  `);

  return boulderId;
}

async function main() {
  loadEnv();

  console.log(`Seeding ${BOULDER_SEED_DATA.length} boulders near Orchard Park, NY...\n`);

  const results = [];

  for (const entry of BOULDER_SEED_DATA) {
    process.stdout.write(`  • ${entry.name} (${entry.grade_label})... `);

    const existing = await runSql(
      `SELECT id FROM public.boulders WHERE name = '${escapeSql(entry.name)}' AND location_label = '${escapeSql(entry.location_label)}' LIMIT 1;`
    );

    let boulderId = existing?.[0]?.id;

    if (boulderId) {
      process.stdout.write("already exists, skipping insert. ");
    } else {
      boulderId = await insertBoulder(entry);
      process.stdout.write("inserted. ");
    }

    let photoPath = null;
    const hasPhoto = await runSql(
      `SELECT id FROM public.boulder_photos WHERE boulder_id = '${boulderId}' LIMIT 1;`
    );
    if (hasPhoto?.length) {
      process.stdout.write("photo exists.\n");
    } else {
      try {
        await downloadPhoto(entry.photoUrl);
        await attachPhotoUrl(OWNER_USER_ID, boulderId, entry.photoUrl);
        process.stdout.write(`photo linked (${entry.photoCredit}).\n`);
      } catch (photoErr) {
        process.stdout.write(`photo failed: ${photoErr.message}\n`);
      }
    }

    results.push({ name: entry.name, id: boulderId, grade: entry.grade_label, photoPath });
  }

  console.log("\nDone! Created/verified boulders:");
  for (const r of results) {
    console.log(`  ${r.name} — ${r.grade} — ${r.id}`);
  }
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message || err);
  process.exit(1);
});
