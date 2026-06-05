import { compressToWebp, formatBytes } from "@/lib/image-compress"

/** One file's progress through compress → upload. */
export type UploadStatus = "queued" | "compressing" | "uploading" | "done" | "error"

export interface UploadItem {
  key: string
  name: string
  status: UploadStatus
  originalBytes?: number
  uploadedBytes?: number
  error?: string
}

/**
 * Compress a file to WebP in the browser, then run the provided upload with the
 * compressed blob. Reports each stage via onStage. Returns true on success,
 * false on failure (so a caller can keep going through the rest of a batch).
 */
export async function compressAndUpload(
  file: File,
  upload: (webp: Blob) => Promise<void>,
  onStage: (patch: Partial<UploadItem>) => void,
): Promise<boolean> {
  try {
    onStage({ status: "compressing" })
    const { blob, originalBytes } = await compressToWebp(file)
    onStage({ status: "uploading", originalBytes, uploadedBytes: blob.size })
    await upload(blob)
    onStage({ status: "done" })
    return true
  } catch (e) {
    onStage({
      status: "error",
      error: e instanceof Error ? e.message : "Upload failed",
    })
    return false
  }
}

/** Per-file progress list with before→after sizes (proof the compression ran). */
export function UploadList({ items }: { items: UploadItem[] }) {
  if (items.length === 0) return null
  return (
    <ul className="mt-4 flex flex-col gap-2">
      {items.map((it) => (
        <li
          key={it.key}
          className="flex items-center justify-between gap-3 border-b border-hairline pb-2"
        >
          <span className="pbm-meta-value min-w-0 truncate">{it.name}</span>
          <span className="shrink-0">
            {it.status === "done" && it.originalBytes && it.uploadedBytes ? (
              <span className="pbm-meta-label text-mute">
                {formatBytes(it.originalBytes)} → {formatBytes(it.uploadedBytes)}
              </span>
            ) : it.status === "error" ? (
              <span className="pbm-meta-label text-error">Failed</span>
            ) : (
              <span className="pbm-meta-label capitalize text-mute">
                {it.status}…
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
