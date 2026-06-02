import { motion } from "framer-motion"

import { founderPortrait } from "@/lib/placeholder-assets"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Homepage fold 2 — "The Mentor".
 *
 * Asymmetric two-column. Tall vertical portrait on the left
 * (5 cols), text on the right (6 cols) offset down by ~80px.
 * Off-white background, 160px vertical fold padding.
 * ──────────────────────────────────────────────────────────── */

export default function HomeAbout() {
  return (
    <section
      id="about"
      aria-label="The Mentor"
      className="relative bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-12">
          {/* ─── Portrait — left 5 cols ─── */}
          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportDefault}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink/5 lg:aspect-[4/5]">
              <img
                src={founderPortrait}
                alt="Prasad Bidapa portrait"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
            </div>
          </motion.figure>

          {/* ─── Copy — right 6 cols, offset down 80px on desktop ─── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportDefault}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12, delayChildren: 0.1 },
              },
            }}
            className="lg:col-span-6 lg:col-start-7 lg:pt-20"
          >
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-10">
              The Mentor
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-l">
              Prasad
              <br />
              Bidapa
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="pbm-display-s mt-8 text-ink/70"
            >
              Four decades shaping Indian fashion.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="pbm-body mt-12 max-w-[42ch] space-y-6"
            >
              <p>
                A pioneering force in Indian fashion, Prasad Bidapa has spent
                decades shaping the country's style landscape through runway
                direction, talent discovery, and fashion entrepreneurship.
                Widely regarded as one of the architects of modern fashion
                presentation in India, he has elevated fashion shows into
                world-class experiences blending creativity, discipline, and
                commercial relevance.
              </p>
              <p>
                His influence spans fashion weeks, luxury showcases, pageants,
                talent platforms, and model development.
              </p>
            </motion.div>

            <motion.blockquote
              variants={fadeUp}
              className="pbm-quote mt-14 max-w-[36ch] border-l border-gold pl-6"
            >
              "India's master artisans are our national treasures."
            </motion.blockquote>

            <motion.div variants={fadeUp} className="mt-12">
              <a href="/about" className="pbm-link text-ink">
                Read the story <span aria-hidden>→</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
