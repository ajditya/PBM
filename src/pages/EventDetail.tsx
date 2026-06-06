import type { ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"

import { pastDiscoveries, pressLogos } from "@/lib/placeholder-assets"
import {
  getEventBySlug,
  getEvents,
  publicUrl,
  type EventRow,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import {
  easeOutExpo,
  fadeUp,
  imageReveal,
  staggerSlow,
  viewportDefault,
} from "@/lib/motion"
import EventCard, { eventRowToCard, formatEventDate } from "@/components/EventCard"

/* ────────────────────────────────────────────────────────────
 * E1 — Event Detail page.
 *
 * B-phase: the event now comes from Supabase (getEventBySlug). The
 * core fields — title, type, date, location, cover, description —
 * are read from the row; the migrated description finally has a
 * home in the About block. The flagship-only sections (extended
 * about copy, past discoveries, city schedule) stay as static brand
 * content and only render when the event's type is "flagship".
 *
 * A nonexistent or unpublished slug resolves to null (anon RLS),
 * so we render a real "event not found" state — never a silent
 * fallback to the wrong event.
 * ──────────────────────────────────────────────────────────── */

const FLAGSHIP_META_ROWS = [
  { label: "Dates", value: "March — June 2026" },
  { label: "Locations", value: "6 Cities" },
  { label: "Auditions Start", value: "15 · 03 · 2026" },
  { label: "Finale", value: "28 · 06 · 2026" },
  { label: "Age Group", value: "16 — 24" },
  { label: "Format", value: "Open Call · Live Runway" },
] as const

const FLAGSHIP_CITY_SCHEDULE = [
  { city: "Bengaluru", date: "15 — 18 March 2026" },
  { city: "Mumbai", date: "29 March — 1 April 2026" },
  { city: "Delhi", date: "12 — 15 April 2026" },
  { city: "Kolkata", date: "26 — 29 April 2026" },
  { city: "Hyderabad", date: "10 — 13 May 2026" },
  { city: "Chennai", date: "24 — 27 May 2026" },
] as const

const FLAGSHIP_HERO_CITIES =
  "Bengaluru · Mumbai · Delhi · Kolkata · Hyderabad · Chennai"

const TYPE_LABEL: Record<EventRow["type"], string> = {
  flagship: "Flagship",
  property: "Property",
}

/** Centered states (loading / not found) reuse the page chrome height. */
function CenteredState({ children }: { children: ReactNode }) {
  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-[1600px] flex-col items-center justify-center px-6 text-center sm:px-10 lg:px-14">
        {children}
      </div>
    </main>
  )
}

export default function EventDetail() {
  const { slug = "" } = useParams()
  const { data: event, loading, error } = useAsyncData(
    () => getEventBySlug(slug),
    [slug],
  )
  // Related events come from the published set; current event filtered out.
  const { data: allEvents } = useAsyncData(getEvents, [])

  if (loading) {
    return (
      <CenteredState>
        <p className="pbm-eyebrow-mute animate-pulse">Loading…</p>
      </CenteredState>
    )
  }

  // Anon RLS already hides unpublished rows, so null = not found / unpublished.
  if (error || !event) {
    return (
      <CenteredState>
        <p className="pbm-eyebrow-mute mb-6">Event not found</p>
        <h1 className="pbm-display-m mb-10">This event isn’t available.</h1>
        <Link to="/events" className="pbm-link text-ink">
          Back to all events <span aria-hidden>→</span>
        </Link>
      </CenteredState>
    )
  }

  const isFlagship = event.type === "flagship"
  const eyebrow = isFlagship
    ? "Flagship · 23rd Edition"
    : "Prasad Bidapa Associates · Since 1985"
  const [titleLine1, ...titleRest] = event.title.split(" ")
  const titleLine2 = titleRest.join(" ")

  const heroDate = isFlagship
    ? "March — June 2026"
    : formatEventDate(event.event_date)
  const heroCities = isFlagship ? FLAGSHIP_HERO_CITIES : event.location ?? ""

  const related = (allEvents ?? [])
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3)

  // Universal meta rows for non-flagship events, derived from the row.
  const universalMetaRows = [
    { label: "Date", value: formatEventDate(event.event_date) || "—" },
    { label: "Location", value: event.location ?? "—" },
    { label: "Category", value: TYPE_LABEL[event.type] },
    { label: "Production", value: "Prasad Bidapa Associates" },
  ] as const

  const metaRows = isFlagship ? FLAGSHIP_META_ROWS : universalMetaRows

  return (
    <main className="bg-paper text-ink">
      {/* ─── Hero (72vh) ─── */}
      <section aria-labelledby="event-heading" className="relative w-full">
        <div className="relative h-[72vh] min-h-[560px] w-full overflow-hidden bg-ink">
          {event.cover_image && (
            <motion.img
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: easeOutExpo }}
              src={publicUrl(event.cover_image)}
              alt={`${event.title} hero`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {/* Dark gradient at bottom */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent"
          />

          {/* Bottom-left meta */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerSlow}
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1600px] px-6 pb-16 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24"
          >
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-8 sm:mb-10">
              {eyebrow}
            </motion.p>

            <motion.h1
              id="event-heading"
              variants={fadeUp}
              className="pbm-display-l text-paper"
            >
              {titleLine1}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}.
                </>
              )}
            </motion.h1>

            {heroCities && (
              <motion.p
                variants={fadeUp}
                className="pbm-eyebrow-mute mt-10 max-w-2xl text-paper/70"
              >
                {heroCities}
              </motion.p>
            )}

            {heroDate && (
              <motion.p variants={fadeUp} className="pbm-display-s mt-6 text-gold">
                {heroDate}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── Body — sticky meta + long-form ─── */}
      <section aria-label="Event details" className="relative bg-paper">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
          <div className="grid grid-cols-1 gap-x-12 gap-y-20 lg:grid-cols-12 lg:gap-x-16">
            {/* ── Sticky meta sidebar (4 cols) ── */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <p className="pbm-eyebrow-mute mb-12">At a glance</p>
                <dl className="space-y-8 border-t border-hairline pt-10">
                  {metaRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col gap-2 border-b border-hairline pb-6"
                    >
                      <dt className="pbm-meta-label">{row.label}</dt>
                      <dd className="pbm-display-xs text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="pbm-bar mt-12 block"
                >
                  {isFlagship
                    ? "Register for Auditions"
                    : "Enquire about this event"}
                  <span aria-hidden className="ml-3">→</span>
                </a>
              </div>
            </aside>

            {/* ── Long-form right column (7 cols, offset 1) ── */}
            <div className="lg:col-span-7 lg:col-start-6">
              {/* About — the row's description leads, then editorial context */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportDefault}
                variants={staggerSlow}
              >
                <motion.p variants={fadeUp} className="pbm-eyebrow mb-8">
                  01 — About
                </motion.p>
                <motion.h2 variants={fadeUp} className="pbm-display-m">
                  {isFlagship ? "About the Hunt." : "About the event."}
                </motion.h2>
                <motion.div
                  variants={fadeUp}
                  className="pbm-body mt-12 max-w-2xl space-y-7"
                >
                  {/* The migrated description gets a home here. */}
                  {event.description && (
                    <p className="text-ink">{event.description}</p>
                  )}

                  {isFlagship ? (
                    <>
                      <p>
                        Founded in 1985 by Prasad Bidapa, the Mega Model Hunt is
                        India's longest-running national model search. For four
                        decades, it has scouted raw talent from six metros and
                        handed them to the country's most demanding designers,
                        photographers, and casting directors.
                      </p>
                      <p>
                        The format is deliberate: open-call auditions in each
                        city, a regional shortlist, three days of intensive
                        workshop training, and a live runway finale judged by an
                        industry panel. Winners are signed to the Prasad Bidapa
                        Models mainboard for two years.
                      </p>
                      <p>
                        The Hunt has discovered Deepika Padukone, Anushka
                        Sharma, Lara Dutta, John Abraham, Arjun Rampal and over
                        150 other names who define editorial India today.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        {event.title} is produced by Prasad Bidapa Associates,
                        the studio behind four decades of Indian fashion
                        programming. Every property we stage is a collaboration
                        with the designers, houses and institutions shaping
                        Indian taste.
                      </p>
                      <p>
                        From flagship runway events to regional fashion weeks
                        and heritage programmes, our productions have built the
                        stages on which a generation of Indian talent first
                        walked.
                      </p>
                    </>
                  )}
                </motion.div>
              </motion.div>

              {/* Flagship-only: Past Discoveries */}
              {isFlagship && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportDefault}
                  variants={staggerSlow}
                  className="mt-32 sm:mt-40"
                >
                  <motion.p variants={fadeUp} className="pbm-eyebrow mb-8">
                    02 — Past Discoveries
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="pbm-display-m">
                    Faces it found first.
                  </motion.h2>

                  <motion.div
                    variants={fadeUp}
                    className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8"
                  >
                    {pastDiscoveries.map((p) => (
                      <figure key={p.name} className="flex flex-col">
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
                          <img
                            src={p.img}
                            alt={p.name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover grayscale"
                          />
                        </div>
                        <figcaption className="pbm-display-xs mt-5 text-ink">
                          {p.name}
                        </figcaption>
                      </figure>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Flagship-only: City Schedule */}
              {isFlagship && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportDefault}
                  variants={staggerSlow}
                  className="mt-32 sm:mt-40"
                >
                  <motion.p variants={fadeUp} className="pbm-eyebrow mb-8">
                    03 — City Schedule
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="pbm-display-m">
                    Six cities. One stage.
                  </motion.h2>

                  <motion.dl
                    variants={fadeUp}
                    className="mt-16 border-t border-hairline"
                  >
                    {FLAGSHIP_CITY_SCHEDULE.map((row) => (
                      <div
                        key={row.city}
                        className="flex items-baseline justify-between gap-6 border-b border-hairline py-6"
                      >
                        <dt className="pbm-display-xs text-ink">{row.city}</dt>
                        <dd className="pbm-meta-label">{row.date}</dd>
                      </div>
                    ))}
                  </motion.dl>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Press strip ─── */}
      <section aria-label="As seen in" className="bg-paper">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={imageReveal}
          className="mx-auto w-full max-w-[1600px] border-y border-hairline px-6 py-12 sm:px-10 sm:py-16 lg:px-14"
        >
          <div className="flex flex-col items-center gap-x-12 gap-y-10 sm:flex-row sm:flex-wrap sm:justify-between">
            <p className="pbm-eyebrow-mute">As seen in</p>
            <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:justify-end sm:gap-x-16">
              {pressLogos.map((logo) => (
                <li
                  key={logo}
                  className="pbm-display-xs text-ink/60 grayscale"
                >
                  {logo}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ─── Related events ─── */}
      {related.length > 0 && (
        <section aria-label="Related events" className="bg-paper">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportDefault}
              variants={staggerSlow}
              className="mb-16 sm:mb-20"
            >
              <motion.p variants={fadeUp} className="pbm-eyebrow-mute mb-6">
                On the calendar
              </motion.p>
              <motion.h2 variants={fadeUp} className="pbm-display-m">
                More events.
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportDefault}
              variants={staggerSlow}
              className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10"
            >
              {related.map((e, i) => (
                <motion.div key={e.slug} variants={fadeUp}>
                  <EventCard
                    event={eventRowToCard(e)}
                    index={i + 1}
                    total={related.length}
                  />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-16 flex justify-center">
              <Link to="/events" className="pbm-link text-ink">
                All events <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
