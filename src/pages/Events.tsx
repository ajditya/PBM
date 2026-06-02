import { motion } from "framer-motion"

import { events } from "@/lib/placeholder-assets"
import { easeOutExpo, fadeUp, staggerSlow, viewportDefault } from "@/lib/motion"
import EventCard from "@/components/EventCard"
import MegaModelHuntFeature from "@/components/sections/MegaModelHuntFeature"
import MindBodySoulFeature from "@/components/sections/MindBodySoulFeature"

/* ────────────────────────────────────────────────────────────
 * Screen 4 — Events page.
 *
 * 50vh header with massive "Events." headline, then the flagship
 * Mega Model Hunt feature, the Mind · Body · Soul program band,
 * and a single grid of every other property. No tabs — all event
 * types are showcased together.
 * ──────────────────────────────────────────────────────────── */

export default function Events() {
  const gridEvents = events.filter((e) => e.type !== "flagship")

  return (
    <main className="bg-paper text-ink">
      {/* ─── Page header (50vh) ─── */}
      <section aria-labelledby="events-heading" className="relative w-full">
        <div className="mx-auto flex min-h-[50vh] w-full max-w-[1600px] flex-col justify-end px-6 pb-14 pt-36 sm:px-10 sm:pb-20 sm:pt-44 lg:px-14 lg:pb-24 lg:pt-56">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="pbm-eyebrow-mute mb-10 sm:mb-14"
          >
            Prasad Bidapa Associates · Since 1985
          </motion.p>

          <motion.h1
            id="events-heading"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.1 }}
            className="pbm-display-xl"
          >
            Events.
          </motion.h1>
        </div>
      </section>

      {/* ─── Flagship feature ─── */}
      <MegaModelHuntFeature />

      {/* ─── Mind · Body · Soul program (dark band) ─── */}
      <MindBodySoulFeature />

      {/* ─── Every other property ─── */}
      <section aria-label="Events & properties" className="bg-paper">
        <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 sm:px-10 sm:pb-32 lg:px-14 lg:pb-40">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportDefault}
            variants={staggerSlow}
            className="mb-16 border-t border-hairline pt-16 sm:mb-20 sm:pt-20"
          >
            <motion.p variants={fadeUp} className="pbm-eyebrow-mute mb-6">
              More from the calendar
            </motion.p>
            <motion.h2 variants={fadeUp} className="pbm-display-m">
              Other properties.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportDefault}
            variants={staggerSlow}
            className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10"
          >
            {gridEvents.map((event, i) => (
              <motion.div key={event.slug} variants={fadeUp}>
                <EventCard
                  event={event}
                  index={i + 1}
                  total={gridEvents.length}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
