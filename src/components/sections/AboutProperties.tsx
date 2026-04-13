import { motion } from "framer-motion"

import { properties } from "@/lib/placeholder-assets"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * About — Section 4: Properties / IPs.
 *
 * Off-white. Section header "Our Properties." then a 4-col grid
 * (2-col mobile) of property cards. Card = full-bleed image,
 * name in Playfair, one-line tagline, year established.
 * ──────────────────────────────────────────────────────────── */

export default function AboutProperties() {
  return (
    <section
      aria-label="Our Properties"
      className="relative bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        {/* ── Header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mb-16 grid grid-cols-1 gap-y-8 lg:mb-24 lg:grid-cols-12"
        >
          <motion.p variants={fadeUp} className="pbm-eyebrow lg:col-span-12">
            03 — The Properties
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="pbm-display-m lg:col-span-7"
          >
            Our Properties.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="pbm-body max-w-[42ch] lg:col-span-4 lg:col-start-9 lg:pt-6"
          >
            Six fashion-week formats, talent hunts and luxury showcases —
            built and run by the same studio for over two decades.
          </motion.p>
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-4 sm:gap-y-16 lg:grid-cols-4"
        >
          {properties.map((p) => (
            <motion.article
              key={p.slug}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:scale-[1.02]"
                />
              </div>
              <p className="pbm-eyebrow mt-5">{p.year}</p>
              <h3 className="pbm-display-xs mt-3 text-ink">{p.title}</h3>
              <p className="pbm-body mt-3 max-w-[34ch] text-ink/65">
                {p.tagline}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
