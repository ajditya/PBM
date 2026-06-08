import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { useSiteContent, useSiteMediaList } from "@/lib/site-media-context"
import { DEFAULT_HOME_COPY } from "@/lib/home-copy"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Homepage fold 4 — "The Events".
 *
 * Mirrored layout from fold 3: image collage on the LEFT,
 * editorial copy on the RIGHT. Off-white background.
 *
 * Collage photos are SHARED with the About page "Associates" trio
 * (the `about_associates_photos` Media slot), so one upload drives
 * both — photo 1 is the tall anchor, photos 2 & 3 stack on the left.
 * Falls back to the static trio when no admin photos are set.
 * ──────────────────────────────────────────────────────────── */

export default function HomeAssociatesTeaser() {
  const photos = useSiteMediaList("about_associates_photos")
  const [tallImage, stackTop, stackBottom] = photos
  const { associatesTeaser } = useSiteContent("home_copy", DEFAULT_HOME_COPY)

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
                {stackTop && (
                  <img
                    src={stackTop}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </figure>

              <figure className="relative row-span-2 aspect-[3/5] overflow-hidden bg-ink/5">
                {tallImage && (
                  <img
                    src={tallImage}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </figure>

              <figure className="relative aspect-square overflow-hidden bg-ink/5">
                {stackBottom && (
                  <img
                    src={stackBottom}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
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
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-10">
              02 / The Events
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="pbm-display-l whitespace-pre-line"
            >
              {associatesTeaser.heading}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="pbm-body mt-10 max-w-[46ch]"
            >
              {associatesTeaser.body}
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
