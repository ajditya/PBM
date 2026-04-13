import { useState } from "react"
import { motion } from "framer-motion"

import { editorial } from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Step 3 — Photos. Renders all three D2 visual states from a
 * single component using a state preview toggle:
 *
 *   - empty:    dashed drop zone, instructions
 *   - uploading: 4 thumbnails + progress on one + "add more"
 *   - error:    4 thumbnails, PRIMARY label, one with red border
 *
 * No real upload — these are visual states only. The form
 * controls live above the component (Back / Continue).
 * ──────────────────────────────────────────────────────────── */

type PhotoState = "empty" | "uploading" | "error"

const SAMPLE_THUMBS = editorial.slice(0, 4)

export default function PhotoUploadStep() {
  const [state, setState] = useState<PhotoState>("empty")

  return (
    <div className="space-y-10">
      {/* ── Demo state toggle ── */}
      <div className="pbm-meta-label flex flex-wrap items-center gap-3">
        <span>Preview</span>
        {(["empty", "uploading", "error"] as const).map((s) => {
          const isActive = state === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              className={`relative pb-1 transition-colors ${
                isActive ? "text-ink" : "text-mute hover:text-ink/70"
              }`}
            >
              {s}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* ── Empty state ── */}
      {state === "empty" && (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="flex h-[320px] w-full flex-col items-center justify-center gap-6 border border-dashed border-ink"
        >
          <p className="pbm-display-s px-6 text-center">
            Drop your photos
            <br />
            or click to upload.
          </p>
          <p className="pbm-body max-w-[44ch] text-center text-mute">
            Minimum 4 photos · Headshot, full-body front, full-body side,
            profile · Natural light · No filters · JPG or PNG · Max 10 MB each
          </p>
        </motion.div>
      )}

      {/* ── Uploading state ── */}
      {state === "uploading" && (
        <motion.div
          key="uploading"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="space-y-8"
        >
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {SAMPLE_THUMBS.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5"
              >
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {i === 1 && (
                  <div className="absolute inset-x-0 bottom-0 h-px bg-paper/30">
                    <motion.div
                      className="h-full origin-left bg-gold"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 0.6 }}
                      transition={{
                        duration: 1.4,
                        ease: easeOutExpo,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex h-[160px] w-full items-center justify-center border border-dashed border-ink">
            <p className="pbm-eyebrow-mute">+ Add more photos</p>
          </div>
        </motion.div>
      )}

      {/* ── Error / complete state ── */}
      {state === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {SAMPLE_THUMBS.map((src, i) => (
              <div key={src} className="relative">
                <div
                  className={`relative aspect-[4/5] w-full overflow-hidden bg-ink/5 ${
                    i === 2 ? "border border-error" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute left-2 top-2 bg-paper px-2 py-1 text-[9px] uppercase tracking-[0.32em] text-gold">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove photo ${i + 1}`}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-paper text-[14px] text-ink hover:text-error"
                  >
                    ×
                  </button>
                </div>
                {i === 2 && (
                  <p className="mt-2 text-[11px] text-error">
                    Image too large — max 10 MB.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex h-[120px] w-full items-center justify-center border border-dashed border-ink">
            <p className="pbm-eyebrow-mute">+ Add more photos</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
