import { useRef } from "react"
import { motion, useMotionValue } from "framer-motion"

import { getEvents } from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { useSiteContent } from "@/lib/site-media-context"
import { DEFAULT_HOME_COPY } from "@/lib/home-copy"
import { fadeUp, viewportDefault } from "@/lib/motion"
import EventCard, { eventRowToCard } from "@/components/EventCard"

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

export default function HomeEventsScroll() {
  const x = useMotionValue(0)
  const rowRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data } = useAsyncData(getEvents, [])
  const row = (data ?? []).slice(0, 4)
  const loading = !data
  const { eventsScroll } = useSiteContent("home_copy", DEFAULT_HOME_COPY)

  return (
    <section
      aria-label="Events"
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
          <motion.p variants={fadeUp} className="pbm-eyebrow mb-6">
            03 / The Calendar
          </motion.p>
          <motion.h2 variants={fadeUp} className="pbm-display-m">
            {eventsScroll.heading}
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
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[78vw] sm:w-[44vw] lg:w-[26rem] xl:w-[28rem]"
                >
                  <div className="aspect-[4/5] w-full animate-pulse bg-ink/5" />
                  <div className="mt-6 space-y-3">
                    <div className="h-5 w-28 animate-pulse bg-ink/5" />
                    <div className="h-5 w-40 animate-pulse bg-ink/5" />
                    <div className="h-2.5 w-20 animate-pulse bg-ink/5" />
                  </div>
                </div>
              ))
            : row.map((event) => (
                <div
                  key={event.slug}
                  className="w-[78vw] sm:w-[44vw] lg:w-[26rem] xl:w-[28rem]"
                >
                  <EventCard event={eventRowToCard(event)} />
                </div>
              ))}
          {/* Trailing breathing room so the last card can clear the right edge */}
          <div aria-hidden className="w-6 sm:w-10 lg:w-14" />
        </motion.div>
      </motion.div>
    </section>
  )
}
