import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import {
  fadeUp,
  imageReveal,
  staggerSlow,
  viewportDefault,
} from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Screen 4 — Flagship section feature.
 *
 * Landscape editorial hero of a runway show, then a two-col
 * editorial layout below: stacked Playfair "Mega / Model / Hunt."
 * on the left with a gold eyebrow, paragraph copy + stats row +
 * CTA bar on the right.
 *
 * B2: the featured event's cover + slug are supplied by the parent
 * (the flagship-typed Supabase row). All other copy is fixed.
 * ──────────────────────────────────────────────────────────── */

const STATS = [
  { value: "22", label: "Editions" },
  { value: "8,000+", label: "Auditions" },
  { value: "150+", label: "Signed Talents" },
  { value: "6", label: "Cities" },
] as const

interface Props {
  /** Public URL of the flagship cover image. Omitted while loading. */
  cover?: string
  /** Flagship event slug for the CTA link. */
  slug?: string
}

export default function MegaModelHuntFeature({
  cover,
  slug = "mega-model-hunt-2026",
}: Props) {
  return (
    <section
      aria-label="Mega Model Hunt — the flagship event"
      className="relative bg-paper text-ink"
    >
      {/* ─── Landscape hero ─── */}
      <motion.figure
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={imageReveal}
        className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5 sm:aspect-[21/9]"
      >
        {cover && (
          <img
            src={cover}
            alt="Mega Model Hunt runway show"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent"
        />
      </motion.figure>

      {/* ─── Two-col body ─── */}
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={staggerSlow}
          className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-12 lg:gap-x-16"
        >
          {/* ── Left — stacked Playfair name ── */}
          <div className="lg:col-span-6">
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-12 sm:mb-16">
              The Flagship · 22 Editions
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-l">
              Mega
              <br />
              Model
              <br />
              Hunt.
            </motion.h2>
          </div>

          {/* ── Right — paragraph, stats, CTA ── */}
          <div className="flex flex-col lg:col-span-6 lg:pt-8">
            <motion.p variants={fadeUp} className="pbm-body max-w-xl">
              The flagship talent discovery platform renowned for scouting,
              mentoring, and developing promising faces for the fashion
              industry. A credible launchpad for aspiring models, it transforms
              potential into professional careers through expert guidance,
              industry exposure, and structured grooming across runway, print,
              advertising, and digital media.
            </motion.p>

            {/* Stats row */}
            <motion.dl
              variants={fadeUp}
              className="mt-16 grid grid-cols-2 gap-y-10 border-t border-hairline pt-12 sm:grid-cols-4 sm:gap-y-0"
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="pbm-display-s text-ink">{s.value}</dt>
                  <dd className="pbm-meta-label mt-3">{s.label}</dd>
                </div>
              ))}
            </motion.dl>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-16">
              <Link to={`/events/${slug}`} className="pbm-bar block">
                Apply for 2026 Edition <span aria-hidden className="ml-3">→</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
