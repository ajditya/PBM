import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { femaleModels, maleModels } from "@/lib/placeholder-assets"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Homepage fold 3 — "The Agency".
 *
 * Full-bleed dark #0a0a0a, 100vh. Asymmetric three-image
 * collage on the right (one tall, two stacked), text on the left.
 * ──────────────────────────────────────────────────────────── */

const tallImage = femaleModels[6].img // Aisha Khanna — anchor portrait
const stackTop = maleModels[0].img // Arjun K.
const stackBottom = femaleModels[4].img // Zara Shah

export default function HomeModelsTeaser() {
  return (
    <section
      aria-label="Prasad Bidapa Models"
      className="relative min-h-screen w-full bg-ink text-paper"
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="grid flex-1 grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
          {/* ─── Copy — left 5 cols ─── */}
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
            className="lg:col-span-5"
          >
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-10">
              01 / The Agency
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-l">
              Prasad
              <br />
              Bidapa
              <br />
              Models
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="pbm-body-inverse mt-10 max-w-[46ch]"
            >
              One of India's most established and trusted model management
              agencies, dedicated to discovering, developing, and representing
              exceptional talent. With decades of experience, the agency has
              launched successful careers while supplying top-tier models for
              campaigns, editorials, runway shows, commercials, and brand
              activations. Known for professionalism, credibility, and quality
              representation.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-12">
              <Link to="/models/female" className="pbm-link text-paper">
                Meet the models <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* ─── Asymmetric collage — right 6 cols ─── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportDefault}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Tall portrait — full left column, spans both rows */}
              <figure className="relative row-span-2 aspect-[3/5] overflow-hidden bg-paper/5">
                <img
                  src={tallImage}
                  alt="Editorial portrait"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>

              {/* Top-right square */}
              <figure className="relative aspect-square overflow-hidden bg-paper/5">
                <img
                  src={stackTop}
                  alt="Editorial portrait"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>

              {/* Bottom-right portrait */}
              <figure className="relative aspect-[4/5] overflow-hidden bg-paper/5">
                <img
                  src={stackBottom}
                  alt="Editorial portrait"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
