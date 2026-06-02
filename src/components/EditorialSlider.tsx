import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { modelGalleryPool } from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * EditorialSlider — single-image lookbook used as the Model
 * Detail page's primary visual.
 *
 * Embeddable: renders no outer <section> or max-width of its own
 * so it can sit inside a grid column beside the stats panel. The
 * stage fills its container width.
 *
 * Layout:
 *   ← [ large editorial photo, soft fade ]  →
 *
 *   ── progress underline ─────────────
 *
 *   01 / 09       ┃     [ thumbnail rail ]
 *
 * No rounded buttons, no shadows, no thumb borders. Arrow keys
 * navigate. Adaptive to any pool size.
 * ──────────────────────────────────────────────────────────── */

interface Props {
  pool?: readonly string[]
  className?: string
}

const fmt = (n: number) => n.toString().padStart(2, "0")

export default function EditorialSlider({ pool, className }: Props) {
  const source = pool && pool.length > 0 ? pool : modelGalleryPool
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const total = source.length
  const safeIndex = Math.min(index, total - 1)

  const goPrev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const goNext = useCallback(() => {
    setDirection(1)
    setIndex((i) => (i + 1) % total)
  }, [total])

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > safeIndex ? 1 : -1)
      setIndex(i)
    },
    [safeIndex],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goPrev, goNext])

  const progress = total <= 1 ? 1 : (safeIndex + 1) / total

  return (
    <div aria-label="Editorial slider" className={className}>
      <div className="w-full">
        {/* ── Stage ── */}
        <div className="relative w-full">
          <div className="relative aspect-[5/7] w-full overflow-hidden bg-ink/5">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={source[safeIndex]}
                src={source[safeIndex]}
                alt={`Editorial portrait ${safeIndex + 1} of ${total}`}
                custom={direction}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{
                  duration: 1.0,
                  ease: easeOutExpo,
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* ── Edge arrows ── */}
          <button
            type="button"
            onClick={goPrev}
            disabled={total <= 1}
            aria-label="Previous photo"
            className="group absolute left-0 top-0 flex h-full w-16 items-center justify-start pl-4 text-paper opacity-80 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30 sm:w-24 sm:pl-6"
          >
            <span
              aria-hidden
              className="inline-block text-2xl font-light leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1 sm:text-3xl"
            >
              ←
            </span>
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={total <= 1}
            aria-label="Next photo"
            className="group absolute right-0 top-0 flex h-full w-16 items-center justify-end pr-4 text-paper opacity-80 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30 sm:w-24 sm:pr-6"
          >
            <span
              aria-hidden
              className="inline-block text-2xl font-light leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 sm:text-3xl"
            >
              →
            </span>
          </button>
        </div>

        {/* ── Progress underline ── */}
        <div className="mt-8 h-px w-full bg-hairline">
          <motion.div
            className="h-full origin-left bg-ink"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            style={{ transformOrigin: "left center" }}
          />
        </div>

        {/* ── Counter + thumbnail rail ── */}
        <div className="mt-6 flex flex-col items-start gap-6 sm:mt-8 sm:flex-row sm:items-center sm:gap-10">
          <div className="shrink-0 font-display text-[28px] font-light leading-none tracking-[-0.01em] text-ink sm:text-[32px]">
            {fmt(safeIndex + 1)}{" "}
            <span className="px-1 text-mute">/</span> {fmt(total)}
          </div>

          <div className="-mx-1 flex w-full gap-1 overflow-x-auto pb-2 sm:gap-2">
            {source.map((src, i) => {
              const isActive = i === safeIndex
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-pressed={isActive}
                  className="group relative shrink-0 focus:outline-none"
                >
                  <div
                    className={`relative aspect-[5/7] w-12 overflow-hidden bg-ink/5 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-16 lg:w-20 ${
                      isActive ? "opacity-100" : "opacity-50 group-hover:opacity-90"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <span
                    aria-hidden
                    className={`absolute -bottom-2 left-0 right-0 h-px origin-left bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
