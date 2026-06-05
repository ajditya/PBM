import { SUPABASE_URL } from "./client"

const PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public`

/**
 * Turn a stored bucket path (e.g. "models/amber/cover.webp") into a public URL.
 * The DB stores bucket-qualified paths, so we just prefix the public base.
 * Reuse this everywhere — never hand-build storage URLs.
 */
export function publicUrl(path: string | null | undefined): string {
  if (!path) return ""
  return `${PUBLIC_BASE}/${path.replace(/^\/+/, "")}`
}
