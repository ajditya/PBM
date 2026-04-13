import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { events } from "@/lib/placeholder-assets"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Homepage fold 4 — "The Events".
 *
 * Mirrored layout from fold 3: image collage on the LEFT,
 * editorial copy on the RIGHT. Off-white background.
 * ──────────────────────────────────────────────────────────── */

const tallImage = events[0].cover // Mega Model Hunt — anchor
const stackTop = events[3].cover // Rajasthan Heritage Week
const stackBottom = events[1].cover // India Men's Fashion Week

export default function HomeAssociatesTeaser() {
  return (
    <section
      aria-label="Prasad Bidapa Associates"
      className="relative bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
          {/* ─── Asymmetric collage — left 6 cols ─── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportDefault}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <figure className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                <img
                  src={stackTop}
                  alt="Rajasthan Heritage Week runway"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>

              <figure className="relative row-span-2 aspect-[3/5] overflow-hidden bg-ink/5">
                <img
                  src={tallImage}
                  alt="Mega Model Hunt runway"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>

              <figure className="relative aspect-square overflow-hidden bg-ink/5">
                <img
                  src={stackBottom}
                  alt="India Men's Fashion Week"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            </div>
          </motion.div>

          {/* ─── Copy — right 5 cols ─── */}
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
            className="lg:col-span-5 lg:col-start-8"
          >
            <motion.p
              variants={fadeUp}
              className="mb-10 text-[11px] tracking-[0.32em] uppercase text-gold"
            >
              02 / The Events
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="font-display font-light text-[48px] leading-[0.95] tracking-[-0.01em] sm:text-[72px] lg:text-[96px]"
            >
              Where talent
              <br />
              is discovered.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-10 max-w-[40ch] text-[15px] leading-[1.7] text-ink/70"
            >
              From the flagship Mega Model Hunt — twenty-two editions and
              counting — to fashion weeks across Mumbai, Colombo and
              Bengaluru, our productions have built the stages on which a
              generation of Indian models first walked.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-12">
              <Link to="/events" className="pbm-link text-ink">
                Explore events <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
