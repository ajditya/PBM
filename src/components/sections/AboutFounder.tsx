import { motion } from "framer-motion"

import { useSiteMedia } from "@/lib/site-media-context"
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
              Prasad Bidapa.
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
              <p>
                A graduate of NID Ahmedabad and a child of Bengaluru's English
                theatre circuit, Prasad Bidapa came into fashion sideways —
                designing costume, then directing runway, then casting the
                faces who would walk it. The instinct for the editorial image
                was there from the first show.
              </p>
              <p>
                Mentored by Martand Singh and Pupul Jayakar — the architects
                of India's craft revival — he carried their conviction that
                the country's master artisans were national treasures. That
                belief threaded itself into every property he has built since,
                from Rajasthan Heritage Week to the LUXO Luxury platform.
              </p>
              <p>
                Across four decades he has discovered Deepika Padukone,
                Anushka Sharma, Lara Dutta, John Abraham, Arjun Rampal,
                Jacqueline Fernandez and Dino Morea — and produced more than
                two hundred runway shows for designers and brands across the
                subcontinent. India Today put him on its 1998 cover; the
                industry has been listening ever since.
              </p>
              <p>
                He still books every model on the roster personally, and still
                writes to the artisans he met in the Eighties.
              </p>
            </motion.div>

            <motion.blockquote
              variants={fadeUp}
              className="pbm-quote mt-14 max-w-[44ch] border-l border-gold pl-6"
            >
              "India's master artisans are our national treasures."
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
