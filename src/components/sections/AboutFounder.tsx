import { motion } from "framer-motion"

import { useSiteContent, useSiteMedia } from "@/lib/site-media-context"
import { DEFAULT_ABOUT_COPY } from "@/lib/about-copy"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * About — Section 3: Founder.
 *
 * Full-bleed dark `#0a0a0a` fold. Vertical portrait on the right,
 * gold "THE FOUNDER" eyebrow + Playfair "Prasad Bidapa." 96px
 * + biography paragraphs on the left.
 * ──────────────────────────────────────────────────────────── */

export default function AboutFounder() {
  const portrait = useSiteMedia("founder_portrait")
  const { founder } = useSiteContent("about_copy", DEFAULT_ABOUT_COPY)

  return (
    <section
      aria-label="The Founder"
      className="relative bg-ink text-paper"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          {/* ── Copy — left ── */}
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
            className="lg:col-span-7 lg:pt-12"
          >
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-10">
              The Founder
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-l">
              {founder.heading}
            </motion.h2>

            <motion.div
              aria-hidden
              variants={fadeUp}
              className="mt-12 h-px w-16 bg-gold"
            />

            <motion.div
              variants={fadeUp}
              className="pbm-body-inverse mt-12 max-w-[58ch] space-y-6"
            >
              {founder.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </motion.div>

            <motion.blockquote
              variants={fadeUp}
              className="pbm-quote mt-14 max-w-[44ch] border-l border-gold pl-6"
            >
              {founder.quote}
            </motion.blockquote>
          </motion.div>

          {/* ── Portrait — right ── */}
          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportDefault}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 lg:col-start-9"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper/5">
              <img
                src={portrait}
                alt="Prasad Bidapa portrait"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
            </div>
            <figcaption className="pbm-eyebrow-mute mt-6 text-paper/50">
              Prasad Bidapa · Bengaluru · 2025
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  )
}
