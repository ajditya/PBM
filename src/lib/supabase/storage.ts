import { SUPABASE_URL } from "./client"

const PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public`

/**
 * Turn a stored bucket path (e.g. "models/amber/cover.webp") into a public URL.
 * The DB stores bucket-qualified paths, so we just prefix the public base.
 * Reuse this everywhere — never hand-build storage URLs.
 *
 * Pass `v` (a version token bumped on each re-upload) to append `?v={v}` as a
 * cache-buster. Re-uploading overwrites the same storage path, so without this
 * the CDN/browser keeps serving the stale bytes. Omitting `v` yields the exact
 * URL as before — fully backward-compatible for slots that store no token.
 */
export function publicUrl(
  path: string | null | undefined,
  v?: string | number | null,
): string {
  if (!path) return ""
  const url = `${PUBLIC_BASE}/${path.replace(/^\/+/, "")}`
  return v ? `${url}?v=${encodeURIComponent(String(v))}` : url
}
