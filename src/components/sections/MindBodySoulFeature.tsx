import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { fadeUp, staggerSlow, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Events — Mind · Body · Soul.
 *
 * A Prasad Bidapa Models grooming program (not an event), sitting
 * on a full-width dark #0a0a0a band below the flagship feature.
 * Gold eyebrow, Playfair off-white headline, program copy, a
 * three-pillar breakdown (Mind / Body / Soul) and an inverted
 * "ENQUIRE ABOUT TRAINING" CTA to the Become a Model intake.
 * ──────────────────────────────────────────────────────────── */

const PILLARS = [
  {
    key: "Mind",
    blurb:
      "Confidence building, personality enhancement and communication skills — the inner work that carries a face through any room.",
  },
  {
    key: "Body",
    blurb:
      "Fitness and runway training that translate presence into movement, posture and a sure command of the stage.",
  },
  {
    key: "Soul",
    blurb:
      "Etiquette, poise and overall presentation — the finish that turns raw potential into a polished, industry-ready professional.",
  },
] as const

export default function MindBodySoulFeature() {
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
              A Prasad Bidapa Models Program
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-l">
              Mind · Body · Soul.
            </motion.h2>
          </div>

          <motion.p
            variants={fadeUp}
            className="pbm-body-inverse mt-12 max-w-[48ch] lg:col-span-5 lg:mt-0 lg:pt-8"
          >
            A comprehensive training and grooming program created to shape
            confident, polished, industry-ready individuals for fashion, media,
            and public presence. Built on complete personal development, it
            focuses on confidence building, personality enhancement, fitness,
            communication skills, etiquette, runway training, and overall
            presentation.
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
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.key}
              variants={fadeUp}
              className="border-t border-hairline-inverse pt-8"
            >
              <p className="pbm-eyebrow-mute">{`0${i + 1}`}</p>
              <h3 className="pbm-display-s mt-5 text-paper">{p.key}</h3>
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
              to="/become-a-model"
              className="inline-flex items-center justify-center bg-paper px-10 py-5 text-[0.8125rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white"
            >
              Enquire about training <span aria-hidden className="ml-3">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
