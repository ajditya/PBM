import { useRef } from "react"
import { motion, useMotionValue } from "framer-motion"

import { events } from "@/lib/placeholder-assets"
import { fadeUp, viewportDefault } from "@/lib/motion"
import EventCard from "@/components/EventCard"

/* ────────────────────────────────────────────────────────────
 * Homepage fold 6 — "UPCOMING & RECENT".
 *
 * Off-white. Section header left-aligned. Below: a horizontal-
 * scroll row of 4 large event cards (3:4 image, Playfair date,
 * title, location, VIEW link).
 *
 * Two interaction modes:
 *   - Touch / trackpad: native horizontal scroll on the container
 *     (overflow-x-auto), scrollbar hidden.
 *   - Pointer drag: framer-motion drag with constraints clamped
 *     to the inner row width.
 *
 * Tailwind v4 doesn't ship a scrollbar-hide utility — handled with
 * an inline style + a global class via attribute selector.
 * ──────────────────────────────────────────────────────────── */

const ROW = events.slice(0, 4)

export default function HomeEventsScroll() {
  const x = useMotionValue(0)
  const rowRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      aria-label="Upcoming & Recent Events"
      className="relative bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10 sm:pt-32 lg:px-14 lg:pt-40">
        {/* ─── Header ─── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16 lg:mb-20"
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 text-[11px] tracking-[0.32em] uppercase text-gold"
          >
            03 / The Calendar
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display font-light text-[40px] leading-[0.95] tracking-[-0.01em] sm:text-[48px] lg:text-[56px]"
          >
            Upcoming &amp; recent.
          </motion.h2>
        </motion.div>
      </div>

      {/* ─── Horizontal scroll rail (full bleed past the gutter) ─── */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportDefault}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative cursor-grab overflow-x-auto pb-32 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <motion.div
          ref={rowRef}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.08}
          dragMomentum={false}
          style={{ x }}
          className="flex w-max items-start gap-6 px-6 sm:gap-8 sm:px-10 lg:gap-10 lg:px-14"
        >
          {ROW.map((event) => (
            <div
              key={event.slug}
              className="w-[78vw] sm:w-[44vw] lg:w-[26rem] xl:w-[28rem]"
            >
              <EventCard event={event} />
            </div>
          ))}
          {/* Trailing breathing room so the last card can clear the right edge */}
          <div aria-hidden className="w-6 sm:w-10 lg:w-14" />
        </motion.div>
      </motion.div>
    </section>
  )
}
