import { useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * H2 — Image Lightbox.
 *
 * Full-viewport ink at 95% opacity. Centered editorial portrait
 * at max 80vh, no border, no rounded. × top-right, ←/→ arrows
 * on the side rails (60% opacity), pagination "03 / 14" tracked
 * bottom-center, optional caption bottom-left. Keyboard nav.
 *
 * Controlled — index/total/captions come from the parent.
 * ──────────────────────────────────────────────────────────── */

interface Props {
  open: boolean
  images: readonly string[]
  index: number
  caption?: string
  onIndexChange: (i: number) => void
  onClose: () => void
}

const fmt = (n: number) => n.toString().padStart(2, "0")

export default function Lightbox({
  open,
  images,
  index,
  caption,
  onIndexChange,
  onClose,
}: Props) {
  const total = images.length
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, total - 1))

  const goPrev = useCallback(
    () => onIndexChange((safeIndex - 1 + total) % total),
    [safeIndex, total, onIndexChange],
  )
  const goNext = useCallback(
    () => onIndexChange((safeIndex + 1) % total),
    [safeIndex, total, onIndexChange],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose, goPrev, goNext])

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && total > 0 && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="fixed inset-0 z-[200] bg-ink/95"
          onClick={onClose}
        >
          {/* ── × close ── */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center text-[18px] font-light text-paper hover:text-gold"
          >
            ×
          </button>

          {/* ── Stage ── */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full items-center justify-center px-16 py-20"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={images[safeIndex]}
                src={images[safeIndex]}
                alt={caption ?? `Image ${safeIndex + 1} of ${total}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="max-h-[80vh] max-w-[90vw] object-contain"
              />
            </AnimatePresence>
          </div>

          {/* ── Side rails ── */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                aria-label="Previous image"
                className="group absolute left-0 top-0 z-10 flex h-full w-16 items-center justify-start pl-4 text-paper opacity-60 transition-opacity duration-500 hover:opacity-100 sm:w-20 sm:pl-6"
              >
                <span aria-hidden className="text-2xl font-light leading-none transition-transform duration-500 group-hover:-translate-x-1 sm:text-3xl">
                  ←
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                aria-label="Next image"
                className="group absolute right-0 top-0 z-10 flex h-full w-16 items-center justify-end pr-4 text-paper opacity-60 transition-opacity duration-500 hover:opacity-100 sm:w-20 sm:pr-6"
              >
                <span aria-hidden className="text-2xl font-light leading-none transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
                  →
                </span>
              </button>
            </>
          )}

          {/* ── Bottom-left caption + bottom-center pagination ── */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between px-6 sm:px-10">
            {caption ? (
              <p className="pbm-meta-label text-paper/70">{caption}</p>
            ) : (
              <span aria-hidden />
            )}
            <p className="pbm-meta-label absolute inset-x-0 text-center text-paper/70">
              {fmt(safeIndex + 1)} <span className="px-1 text-mute">/</span>{" "}
              {fmt(total)}
            </p>
            <span aria-hidden />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
