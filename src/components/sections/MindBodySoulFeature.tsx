import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { fadeUp, staggerSlow, viewportDefault } from "@/lib/motion"
import {
  DEFAULT_MIND_BODY_SOUL,
  type MindBodySoulContent,
} from "@/lib/mind-body-soul"

/* ────────────────────────────────────────────────────────────
 * Events — Mind · Body · Soul.
 *
 * A Prasad Bidapa Models grooming program (not an event), sitting
 * on a full-width dark #0a0a0a band below the flagship feature.
 * Gold eyebrow, Playfair off-white headline, program copy, a
 * three-pillar breakdown (Mind / Body / Soul) and an inverted
 * "ENQUIRE ABOUT TRAINING" CTA to the Become a Model intake.
 *
 * Content is editable: it comes from the `mind_body_soul`
 * site_settings row (via getMindBodySoul) and is passed in as
 * `content`. Falls back to the original copy if absent, so the
 * section never disappears.
 * ──────────────────────────────────────────────────────────── */

export default function MindBodySoulFeature({
  content = DEFAULT_MIND_BODY_SOUL,
}: {
  content?: MindBodySoulContent
}) {
  return (
    <section
      aria-label="Mind · Body · Soul — a Prasad Bidapa Models program"
      className="relative bg-ink text-paper"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        {/* ── Header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={staggerSlow}
          className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-16"
        >
          <div className="lg:col-span-7">
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-10">
              {content.eyebrow}
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-l">
              {content.heading}
            </motion.h2>
          </div>

          <motion.p
            variants={fadeUp}
            className="pbm-body-inverse mt-12 max-w-[48ch] lg:col-span-5 lg:mt-0 lg:pt-8"
          >
            {content.description}
          </motion.p>
        </motion.div>

        {/* ── Three pillars ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={staggerSlow}
          className="mt-20 grid grid-cols-1 gap-x-12 gap-y-12 sm:mt-28 sm:grid-cols-3 sm:gap-x-10"
        >
          {content.pillars.map((p, i) => (
            <motion.div
              key={p.label}
              variants={fadeUp}
              className="border-t border-hairline-inverse pt-8"
            >
              <p className="pbm-eyebrow-mute">{`0${i + 1}`}</p>
              <h3 className="pbm-display-s mt-5 text-paper">{p.label}</h3>
              <p className="pbm-body-inverse mt-5 max-w-[34ch]">{p.blurb}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA — inverted bar on the dark band ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={staggerSlow}
          className="mt-16 sm:mt-20"
        >
          <motion.div variants={fadeUp}>
            <Link
              to={content.cta_href}
              className="inline-flex items-center justify-center bg-paper px-10 py-5 text-[0.8125rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white"
            >
              {content.cta_label} <span aria-hidden className="ml-3">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
