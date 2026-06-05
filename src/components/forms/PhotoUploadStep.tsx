import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Step 3 — Photos. Controlled real-file picker.
 *
 * Parent (ApplicationForm) owns the accepted File[] and passes it back
 * down; this component handles selection (click + drag/drop), per-file
 * client validation, thumbnail previews, and removal. The empty /
 * uploading-grid / error visual language from the original mock is
 * preserved — the grid now renders real object URLs, the first photo is
 * labelled "Primary", and rejected files surface the red hairline caption.
 *
 * Server-side validation is authoritative (Edge Function + bucket limits);
 * these checks just give the applicant immediate, on-brand feedback.
 * ──────────────────────────────────────────────────────────── */

const ACCEPT = "image/jpeg,image/png,image/webp"
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
export const MAX_PHOTOS = 8
export const MIN_PHOTOS = 4

interface Props {
  files: File[]
  onChange: (files: File[]) => void
  disabled?: boolean
}

interface Rejection {
  name: string
  reason: string
}

export default function PhotoUploadStep({ files, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [rejected, setRejected] = useState<Rejection[]>([])
  const [dragging, setDragging] = useState(false)

  // Build (and reliably revoke) object URLs for the current file list.
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  const addFiles = (incoming: FileList | File[]) => {
    if (disabled) return
    const next = [...files]
    const rejects: Rejection[] = []

    for (const file of Array.from(incoming)) {
      if (!ALLOWED_TYPES.has(file.type)) {
        rejects.push({ name: file.name, reason: "Only JPG, PNG or WebP." })
        continue
      }
      if (file.size > MAX_BYTES) {
        rejects.push({ name: file.name, reason: "Image too large — max 10 MB." })
        continue
      }
      // De-dupe on name+size so re-selecting the same files is idempotent.
      const dupe = next.some((f) => f.name === file.name && f.size === file.size)
      if (dupe) continue
      if (next.length >= MAX_PHOTOS) {
        rejects.push({ name: file.name, reason: `Maximum ${MAX_PHOTOS} photos.` })
        continue
      }
      next.push(file)
    }

    setRejected(rejects)
    onChange(next)
  }

  const removeAt = (index: number) => {
    if (disabled) return
    onChange(files.filter((_, i) => i !== index))
  }

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  const hasFiles = files.length > 0
  const atCap = files.length >= MAX_PHOTOS

  return (
    <div className="space-y-8">
      {/* Hidden real input — opened by the drop zones below. */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files)
          e.target.value = "" // allow re-selecting the same file later
        }}
      />

      {!hasFiles ? (
        /* ── Empty state — dashed drop zone ── */
        <motion.button
          type="button"
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className={`flex h-[320px] w-full flex-col items-center justify-center gap-6 border border-dashed border-ink px-6 text-center transition-colors disabled:cursor-not-allowed ${
            dragging ? "bg-ink/5" : ""
          }`}
        >
          <span className="pbm-display-s">
            Drop your photos
            <br />
            or click to upload.
          </span>
          <span className="pbm-body max-w-[44ch] text-mute">
            Minimum {MIN_PHOTOS} photos · Headshot, full-body front, full-body
            side, profile · Natural light · No filters · JPG, PNG or WebP · Max
            10 MB each
          </span>
        </motion.button>
      ) : (
        /* ── Populated state — real thumbnails grid ── */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {files.map((file, i) => (
              <div key={`${file.name}-${file.size}`} className="relative">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
                  {previews[i] && (
                    <img
                      src={previews[i]}
                      alt={`Photo ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  {i === 0 && (
                    <span className="absolute left-2 top-2 bg-paper px-2 py-1 text-[9px] uppercase tracking-[0.32em] text-gold">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    disabled={disabled}
                    aria-label={`Remove photo ${i + 1}`}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-paper text-[14px] text-ink transition-colors hover:text-error disabled:cursor-not-allowed"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add-more zone, hidden once at the cap. */}
          {!atCap && (
            <button
              type="button"
              onClick={openPicker}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              disabled={disabled}
              className={`flex h-[120px] w-full items-center justify-center border border-dashed border-ink transition-colors disabled:cursor-not-allowed ${
                dragging ? "bg-ink/5" : ""
              }`}
            >
              <span className="pbm-eyebrow-mute">+ Add more photos</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Count + rejection captions (hairline red, no icons). */}
      <div className="space-y-2">
        {hasFiles && (
          <p className="pbm-meta-label">
            {files.length} of {MAX_PHOTOS} · minimum {MIN_PHOTOS}
          </p>
        )}
        {rejected.map((r) => (
          <p key={r.name} className="text-[11px] text-error">
            {r.name} — {r.reason}
          </p>
        ))}
      </div>
    </div>
  )
}
