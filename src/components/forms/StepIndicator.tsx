import { motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * StepIndicator — 4-step editorial progress strip.
 *
 *   01 — PERSONAL · 02 — MEASUREMENTS · 03 — PHOTOS · 04 — REVIEW
 *
 * Active step in ink, completed in ink/60, upcoming in mute.
 * Hairlines connect each label. No pills, no fills.
 * ──────────────────────────────────────────────────────────── */

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Measurements" },
  { id: 3, label: "Photos" },
  { id: 4, label: "Review" },
] as const

interface Props {
  current: number
}

const fmt = (n: number) => n.toString().padStart(2, "0")

export default function StepIndicator({ current }: Props) {
  return (
    <nav
      aria-label="Application progress"
      className="w-full"
    >
      <ol className="flex w-full items-center gap-3 sm:gap-6">
        {STEPS.map((step, i) => {
          const isActive = step.id === current
          const isComplete = step.id < current

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center gap-3 sm:gap-6"
            >
              <div className="flex items-baseline gap-3">
                <span
                  className={`pbm-meta-label ${
                    isActive
                      ? "text-ink"
                      : isComplete
                        ? "text-ink/60"
                        : "text-mute"
                  }`}
                >
                  {fmt(step.id)}
                </span>
                <span
                  className={`pbm-meta-label hidden sm:inline ${
                    isActive
                      ? "text-ink"
                      : isComplete
                        ? "text-ink/60"
                        : "text-mute"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="relative h-px flex-1 bg-hairline">
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 origin-left bg-ink"
                    initial={false}
                    animate={{ scaleX: isComplete ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: easeOutExpo }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
