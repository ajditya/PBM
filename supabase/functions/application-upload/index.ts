// Edge Function: application-upload
//
// Issues short-lived signed upload URLs scoped to the PRIVATE `applications`
// storage bucket so the public Become-a-Model form can upload applicant photos
// without any anon storage policy (none exists — that bucket is private by
// design). The browser never sees the service key; it only receives per-file
// signed upload tokens and uploads directly to them.
//
// Flow: client POSTs photo METADATA (name/type/size) -> we validate everything
// first -> only then mint one signed upload URL per file -> client uploads each
// file via uploadToSignedUrl, then inserts the model_applications row (anon
// INSERT) using `applicationId` as the row id so it matches the photo folder.
//
// Defense in depth: the bucket itself is also constrained to images <= 10 MB
// (migration 20260604000004), so even a forged metadata claim cannot smuggle a
// non-image or oversized file past the signed URL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const BUCKET = "applications"
const MIN_FILES = 1
const MAX_FILES = 8
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

// Explicit origin allowlist — NEVER a blanket "*". Production origins are added
// via the ALLOWED_ORIGINS env var (comma-separated) without a code change; the
// localhost defaults cover the Vite dev server (its port drifts 5173–5177).
const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
]
const ALLOWED_ORIGINS = new Set<string>([
  ...DEFAULT_ORIGINS,
  ...(Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
])

/** CORS headers. Reflects the request Origin only when it is allowlisted —
 *  otherwise the Allow-Origin is empty and the browser blocks the response. */
function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : ""
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  })
}

/** Reduce an untrusted client filename to a safe basename:
 *  - strip any directory components / path-traversal (`../`, `\`, `/`)
 *  - drop the original extension and re-derive it from the validated mime type
 *  - restrict to a conservative charset, no leading dot/dash, bounded length */
function safeName(name: string, type: string): string {
  const base = (name.split(/[\\/]/).pop() ?? "photo") // drop any path segments
    .replace(/\.[^.]*$/, "") // drop original extension
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-") // conservative charset only
    .replace(/^[-.]+/, "") // no leading dots or dashes
    .slice(0, 48)
  const stem = base.length > 0 ? base : "photo"
  return `${stem}.${EXT_BY_TYPE[type]}` // extension from mime type, not filename
}

interface IncomingFile {
  name: string
  type: string
  size: number
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin")

  // 1. CORS preflight.
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }
  // 2. Reject a browser request from a non-allowlisted origin outright.
  //    (A null Origin — e.g. server-to-server — is allowed to pass to auth.)
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: "Origin not allowed" }, 403, origin)
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin)
  }

  // 3. Parse + FULLY VALIDATE the request before any signed URL is minted.
  let files: unknown
  try {
    const body = await req.json()
    files = (body as { files?: unknown }).files
  } catch {
    return json({ error: "Invalid JSON body" }, 400, origin)
  }

  if (!Array.isArray(files) || files.length < MIN_FILES) {
    return json({ error: "At least one photo is required." }, 400, origin)
  }
  if (files.length > MAX_FILES) {
    return json(
      { error: `A maximum of ${MAX_FILES} photos is allowed.` },
      400,
      origin,
    )
  }
  for (const [i, raw] of files.entries()) {
    const f = raw as Partial<IncomingFile>
    if (typeof f?.type !== "string" || !ALLOWED_TYPES.has(f.type)) {
      return json(
        { error: `Photo ${i + 1}: only JPG, PNG or WebP images are allowed.` },
        400,
        origin,
      )
    }
    if (
      typeof f?.size !== "number" ||
      !Number.isFinite(f.size) ||
      f.size <= 0 ||
      f.size > MAX_BYTES
    ) {
      return json(
        { error: `Photo ${i + 1}: each image must be 10 MB or smaller.` },
        400,
        origin,
      )
    }
    if (typeof f?.name !== "string" || f.name.length === 0) {
      return json({ error: `Photo ${i + 1}: missing filename.` }, 400, origin)
    }
  }

  // 4. Only now — every file validated — read the service credentials.
  //    Both are auto-injected into the Edge runtime by Supabase; the service
  //    key is read ONLY from the environment and never leaves this function.
  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "Server is not configured." }, 500, origin)
  }
  const admin = createClient(supabaseUrl, serviceKey)

  // 5. Mint one signed upload URL per file under a single per-application folder.
  const applicationId = crypto.randomUUID()
  const valid = files as IncomingFile[]
  const uploads: { path: string; token: string }[] = []

  for (const [i, f] of valid.entries()) {
    const path = `${applicationId}/${i}-${safeName(f.name, f.type)}`
    const { data, error } = await admin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path)
    if (error || !data) {
      return json({ error: "Could not create an upload URL." }, 500, origin)
    }
    // `path` is the in-bucket path; the client uploads with uploadToSignedUrl
    // and stores `path` in model_applications.photo_paths. Admin later resolves
    // it via from('applications').createSignedUrl(path).
    uploads.push({ path, token: data.token })
  }

  return json({ applicationId, uploads }, 200, origin)
})
