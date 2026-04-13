import { useMemo, useState } from "react"
import { motion } from "framer-motion"

import { events } from "@/lib/placeholder-assets"
import { easeOutExpo, fadeUp, staggerSlow, viewportDefault } from "@/lib/motion"
import EventCard from "@/components/EventCard"
import MegaModelHuntFeature from "@/components/sections/MegaModelHuntFeature"

/* ────────────────────────────────────────────────────────────
 * Screen 4 — Events page.
 *
 * 50vh header with massive "Events." headline, eyebrow tagline,
 * and a sticky text tab bar (FLAGSHIP · UPCOMING · PAST · RECURRING)
 * with an animated gold underline on the active tab.
 *
 * - FLAGSHIP tab: shows the MegaModelHuntFeature, then a 3-col
 *   grid of every non-flagship event.
 * - Other tabs: filter the grid by event type, no flagship feature.
 *
 * Empty states (E3) are stubbed via a simple centered headline.
 * ──────────────────────────────────────────────────────────── */

const TABS = ["Flagship", "Upcoming", "Past", "Recurring"] as const
type Tab = (typeof TABS)[number]

const TAB_TYPE: Record<Tab, "flagship" | "upcoming" | "past" | "recurring"> = {
  Flagship: "flagship",
  Upcoming: "upcoming",
  Past: "past",
  Recurring: "recurring",
}

export default function Events() {
  const [activeTab, setActiveTab] = useState<Tab>("Flagship")

  const gridEvents = useMemo(() => {
    if (activeTab === "Flagship") {
      // Flagship view shows the feature + everything else as a grid
      return events.filter((e) => e.type !== "flagship")
    }
    return events.filter((e) => e.type === TAB_TYPE[activeTab])
  }, [activeTab])

  return (
    <main className="bg-paper text-ink">
      {/* ─── Page header (50vh) ─── */}
      <section
        aria-labelledby="events-heading"
        className="relative w-full"
      >
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

      {/* ─── Sticky tab bar ─── */}
      <div className="sticky top-[72px] z-30 border-y border-hairline bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-x-8 overflow-x-auto px-6 py-5 sm:gap-x-12 sm:px-10 sm:py-6 lg:px-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const isActive = t === activeTab
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                aria-pressed={isActive}
                className={`pbm-ui relative inline-flex h-6 shrink-0 items-center px-px transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {t}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Flagship feature (only on Flagship tab) ─── */}
      {activeTab === "Flagship" && <MegaModelHuntFeature />}

      {/* ─── Other events grid ─── */}
      <section
        aria-label={`${activeTab} events grid`}
        className="bg-paper"
      >
        <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 sm:px-10 sm:pb-32 lg:px-14 lg:pb-40">
          {activeTab === "Flagship" && (
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
          )}

          {gridEvents.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <p className="pbm-eyebrow-mute mb-6">
                Nothing on the calendar yet
              </p>
              <h3 className="pbm-display-m">
                New events
                <br />
                coming soon.
              </h3>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </main>
  )
}
