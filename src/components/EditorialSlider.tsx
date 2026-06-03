import { AnimatePresence, motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"
import {
  useEditorialSlider,
  type EditorialSliderState,
} from "@/hooks/useEditorialSlider"

/* ────────────────────────────────────────────────────────────
 * EditorialSlider — single-image lookbook used as the Model
 * Detail page's primary visual.
 *
 * Split architecture: the slider state lives in a hook
 * (`useEditorialSlider`, in src/hooks) so the large image stage
 * and the navigation controls (counter + progress + thumbnail
 * rail) can be placed in *separate* grid cells. On the Model
 * Detail page the stage sits on the right and the controls on
 * the left, above the measurements.
 *
 * `EditorialSlider` (default export) still composes the two for
 * any caller that wants the stacked layout.
 * ──────────────────────────────────────────────────────────── */

const fmt = (n: number) => n.toString().padStart(2, "0")

/* ── Stage — the large editorial photo with edge arrows ── */
export function SliderStage({
  state,
  className,
}: {
  state: EditorialSliderState
  className?: string
}) {
  const { source, safeIndex, total, direction, goPrev, goNext } = state

  return (
    <div aria-label="Editorial slider" className={className}>
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
    </div>
  )
}

/* ── Controls — progress underline + counter + thumbnail rail ── */
export function SliderControls({
  state,
  className,
}: {
  state: EditorialSliderState
  className?: string
}) {
  const { source, safeIndex, total, progress, goTo } = state

  return (
    <div className={className}>
      {/* ── Progress underline ── */}
      <div className="h-px w-full bg-hairline">
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
  )
}

interface Props {
  pool?: readonly string[]
  className?: string
}

/* ── Stacked composition (stage above controls) ── */
export default function EditorialSlider({ pool, className }: Props) {
  const state = useEditorialSlider(pool)

  return (
    <div className={className}>
      <div className="w-full">
        <SliderStage state={state} />
        <SliderControls state={state} className="mt-8" />
      </div>
    </div>
  )
}
