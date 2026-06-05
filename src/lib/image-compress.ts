/**
 * Client-side image compression — the browser equivalent of the B1 sharp step
 * (resize to ~2000px long edge, WebP q≈80). This runs in the browser BEFORE
 * upload via a canvas encode, so the bytes that reach Supabase storage are
 * already the compressed WebP — no server/script step, the same ~98% reduction
 * applied automatically to every uploaded photo.
 */

const MAX_EDGE = 2000
const QUALITY = 0.8

export interface CompressResult {
  blob: Blob
  width: number
  height: number
  /** Original file size in bytes, for before/after reporting. */
  originalBytes: number
}

/**
 * Decode (honoring EXIF orientation), downscale to maxEdge on the long side
 * without enlarging, and re-encode as WebP. Returns the compressed blob.
 */
export async function compressToWebp(
  file: File,
  maxEdge = MAX_EDGE,
  quality = QUALITY,
): Promise<CompressResult> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  const sw = bitmap.width
  const sh = bitmap.height
  const scale = Math.min(1, maxEdge / Math.max(sw, sh))
  const w = Math.max(1, Math.round(sw * scale))
  const h = Math.max(1, Math.round(sh * scale))

  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    bitmap.close()
    throw new Error("Canvas 2D context unavailable")
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", quality),
  )
  if (!blob) throw new Error("WebP encoding failed — browser may not support it")

  return { blob, width: w, height: h, originalBytes: file.size }
}

/** Human-friendly byte size, e.g. "284 KB" / "5.2 MB" / "0.94 GB". */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`
}
