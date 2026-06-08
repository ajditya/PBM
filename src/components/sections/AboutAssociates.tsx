import { motion } from "framer-motion"

import { associatesServices } from "@/lib/placeholder-assets"
import { useSiteContent, useSiteMediaList } from "@/lib/site-media-context"
import { DEFAULT_ABOUT_COPY } from "@/lib/about-copy"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * About — Section 1: Prasad Bidapa Associates.
 *
 * Asymmetric two-col. Stacked editorial photo trio on the left
 * (5 cols), copy on the right (6 cols offset down ~80 px).
 * Off-white background, fold padding.
 * ──────────────────────────────────────────────────────────── */

export default function AboutAssociates() {
  const photos = useSiteMediaList("about_associates_photos")
  const { associates } = useSiteContent("about_copy", DEFAULT_ABOUT_COPY)

  return (
    <section
      aria-label="The Associates"
      className="relative bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          {/* ── Photo trio ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportDefault}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="flex flex-col gap-3 lg:col-span-5"
          >
            {photos.map((src, i) => (
              <motion.figure
                key={src}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className={
                  i === 0
                    ? "relative aspect-[4/5] w-full overflow-hidden bg-ink/5"
                    : i === 1
                      ? "relative aspect-[4/3] w-[85%] self-end overflow-hidden bg-ink/5"
                      : "relative aspect-[4/5] w-[70%] overflow-hidden bg-ink/5"
                }
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </motion.figure>
            ))}
          </motion.div>

          {/* ── Copy ── */}
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
            className="lg:col-span-6 lg:col-start-7 lg:pt-24"
          >
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-10">
              02 — The Production House
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-m">
              {associates.heading}
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="pbm-body mt-12 max-w-[46ch] space-y-6"
            >
              {associates.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </motion.div>

            {/* Services list */}
            <motion.ul
              variants={fadeUp}
              className="pbm-eyebrow-mute mt-14 grid grid-cols-1 gap-y-3 text-ink/70 sm:grid-cols-2 sm:gap-x-10"
            >
              {associatesServices.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-3 border-b border-hairline pb-3"
                >
                  <span aria-hidden className="h-1 w-1 bg-gold" />
                  {s}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
