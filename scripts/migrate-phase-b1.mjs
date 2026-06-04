// Phase B1 — upload optimized WebPs + insert DB rows (models, model_gallery, events).
// Uses the service_role key (read from .env.migration.local or env), never hardcoded.
// Idempotent: storage upserts; models/events upsert by slug; gallery delete-then-insert.
//
//   node scripts/migrate-phase-b1.mjs
//
import { createClient } from "@supabase/supabase-js"
import { readFile } from "node:fs/promises"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const WORK = "C:/Users/Pc/Desktop/4AM Projects/PBM/.migrate-work"
const ROOT = process.cwd() // run from project root: node scripts/migrate-phase-b1.mjs

// ---- load env (no secrets in source) ------------------------------------
function parseEnv(file) {
  if (!existsSync(file)) return {}
  const out = {}
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, "")
  }
  return out
}

const localEnv = parseEnv(path.join(ROOT, ".env.local"))
const migEnv = parseEnv(path.join(ROOT, ".env.migration.local"))

const SUPABASE_URL =
  process.env.SUPABASE_URL || localEnv.VITE_SUPABASE_URL || "https://gjrztpzefbaxntknotwe.supabase.co"
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || migEnv.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_KEY) {
  console.error(
    "ERROR: service_role key not found. Put it in scripts/../.env.migration.local as\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=...\n(or export SUPABASE_SERVICE_ROLE_KEY).",
  )
  process.exit(2)
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// ---- data ---------------------------------------------------------------
const MODELS = [
  {
    slug: "amber",
    name: "Amber",
    gender: "female",
    galleryCount: 17,
    sort_order: 0,
    stats: { height: "176 cm", bust: "82", waist: "60", hips: "88", hair: "Black", eyes: "Brown", shoes: "38", location: "Bengaluru", board: "mainboard" },
  },
  {
    slug: "rana",
    name: "Rana",
    gender: "male",
    galleryCount: 9,
    sort_order: 0,
    stats: { height: "186 cm", bust: "98", waist: "78", hips: "93", hair: "Black", eyes: "Brown", shoes: "43", location: "Mumbai", board: "mainboard" },
  },
]

const EVENTS = [
  { slug: "mega-model-hunt-2026", title: "Mega Model Hunt 2026", type: "flagship", event_date: "2026-03-15", location: "Bengaluru", description: "India's longest-running supermodel discovery platform." },
  { slug: "india-mens-fashion-week", title: "India Men's Fashion Week", type: "property", event_date: "2026-04-22", location: "Mumbai", description: "The country's first dedicated menswear runway." },
  { slug: "colombo-fashion-week", title: "Colombo Fashion Week", type: "property", event_date: "2026-05-10", location: "Colombo", description: "South Asia's regional fashion summit." },
  { slug: "rajasthan-heritage-week", title: "Rajasthan Heritage Week", type: "property", event_date: "2025-11-18", location: "Jaipur", description: "A celebration of artisanal craft and royal textile." },
  { slug: "luxo-luxury-weeks", title: "LUXO Luxury Weeks", type: "property", event_date: "2025-12-02", location: "Delhi", description: "A curated luxury runway across India's metros." },
  { slug: "kingfisher-fashion-awards", title: "Kingfisher Fashion Awards", type: "property", event_date: "2025-09-20", location: "Mumbai", description: "Honouring two decades of Indian fashion excellence." },
]

// ---- helpers ------------------------------------------------------------
// objectPath like "models/amber/cover.webp" -> bucket "models", path "amber/cover.webp"
async function upload(objectPath) {
  const bucket = objectPath.split("/")[0]
  const inBucket = objectPath.split("/").slice(1).join("/")
  const body = await readFile(path.join(WORK, objectPath))
  const { error } = await sb.storage
    .from(bucket)
    .upload(inBucket, body, { contentType: "image/webp", upsert: true })
  if (error) throw new Error(`upload ${objectPath}: ${error.message}`)
  return objectPath
}

async function publicUrlOk(objectPath) {
  const bucket = objectPath.split("/")[0]
  const inBucket = objectPath.split("/").slice(1).join("/")
  const { data } = sb.storage.from(bucket).getPublicUrl(inBucket)
  const res = await fetch(data.publicUrl, { method: "GET" })
  return { url: data.publicUrl, status: res.status, type: res.headers.get("content-type"), bytes: (await res.arrayBuffer()).byteLength }
}

// ---- run ----------------------------------------------------------------
async function run() {
  let uploaded = 0

  // 1) Upload + insert models & galleries
  for (const m of MODELS) {
    await upload(`models/${m.slug}/cover.webp`)
    uploaded++
    const galleryPaths = []
    for (let i = 1; i <= m.galleryCount; i++) {
      const p = `models/${m.slug}/gallery/${i}.webp`
      await upload(p)
      uploaded++
      galleryPaths.push(p)
    }

    const { data: modelRow, error: mErr } = await sb
      .from("models")
      .upsert(
        {
          name: m.name,
          slug: m.slug,
          gender: m.gender,
          cover_image: `models/${m.slug}/cover.webp`,
          ...m.stats,
          sort_order: m.sort_order,
          published: true,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single()
    if (mErr) throw new Error(`insert model ${m.slug}: ${mErr.message}`)

    // gallery: delete-then-insert for idempotency
    await sb.from("model_gallery").delete().eq("model_id", modelRow.id)
    const rows = galleryPaths.map((image_path, idx) => ({ model_id: modelRow.id, image_path, sort_order: idx }))
    const { error: gErr } = await sb.from("model_gallery").insert(rows)
    if (gErr) throw new Error(`insert gallery ${m.slug}: ${gErr.message}`)
    console.log(`model ${m.slug}: id=${modelRow.id} cover + ${rows.length} gallery rows`)
  }

  // 2) Upload + insert events
  for (let i = 0; i < EVENTS.length; i++) {
    const e = EVENTS[i]
    await upload(`events/${e.slug}/cover.webp`)
    uploaded++
    const { error: eErr } = await sb.from("events").upsert(
      {
        title: e.title,
        slug: e.slug,
        type: e.type,
        event_date: e.event_date,
        location: e.location,
        description: e.description,
        cover_image: `events/${e.slug}/cover.webp`,
        sort_order: i,
        published: true,
      },
      { onConflict: "slug" },
    )
    if (eErr) throw new Error(`insert event ${e.slug}: ${eErr.message}`)
    console.log(`event ${e.slug}: ${e.type} ${e.event_date}`)
  }

  console.log(`\nuploaded ${uploaded} objects.`)

  // 3) Public-URL spot checks
  console.log("\n=== public URL checks ===")
  for (const p of ["models/amber/cover.webp", "models/amber/gallery/1.webp", "models/rana/cover.webp", "events/mega-model-hunt-2026/cover.webp"]) {
    const r = await publicUrlOk(p)
    console.log(`${r.status}  ${r.type}  ${(r.bytes / 1024).toFixed(0)}KB  ${r.url}`)
  }

  // 4) applications bucket must remain private (negative check)
  console.log("\n=== applications bucket privacy check ===")
  const appUrl = `${SUPABASE_URL}/storage/v1/object/public/applications/probe.webp`
  const appRes = await fetch(appUrl)
  console.log(`anon GET applications/probe.webp -> ${appRes.status} (expect 400/404, never 200)`)
}

run().catch((e) => {
  console.error("MIGRATION FAILED:", e.message)
  process.exit(1)
})
