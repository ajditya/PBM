import { motion } from "framer-motion"

import { aboutModelsPhotos, modelsServices } from "@/lib/placeholder-assets"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * About — Section 2: Prasad Bidapa Models.
 *
 * Mirrored layout — copy LEFT, photo trio RIGHT. Off-white
 * background, fold padding. Reads as the natural counterpart to
 * AboutAssociates.
 * ──────────────────────────────────────────────────────────── */

export default function AboutModels() {
  return (
    <section
      aria-label="The Models"
      className="relative bg-paper text-ink"
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
            className="order-2 lg:order-1 lg:col-span-6 lg:pt-24"
          >
            <motion.p variants={fadeUp} className="pbm-eyebrow mb-10">
              02 — The Agency
            </motion.p>

            <motion.h2 variants={fadeUp} className="pbm-display-m">
              The Models.
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="pbm-body mt-12 max-w-[42ch] space-y-6"
            >
              <p>
                Prasad Bidapa Models is the agency arm — a curated roster of
                women and men working across editorial, runway, lookbook and
                campaign. Forty years of casting has shaped a precise eye for
                the faces that translate to the page.
              </p>
              <p>
                We supply talent to designers, magazines and luxury houses
                across India and internationally, and develop new boards in
                Bengaluru, Mumbai and Delhi. Mainboard, New Faces, Development
                and Digital sit under one roof, on one wall, with one promise
                to every booker who walks in.
              </p>
              <p>
                The discoveries — Deepika Padukone, Anushka Sharma, Lara Dutta,
                John Abraham, Arjun Rampal, Jacqueline Fernandez — speak to a
                method that has not changed in four decades.
              </p>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="pbm-eyebrow-mute mt-14 grid grid-cols-1 gap-y-3 text-ink/70 sm:grid-cols-2 sm:gap-x-10"
            >
              {modelsServices.map((s) => (
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

          {/* ── Photo trio — right ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportDefault}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="order-1 flex flex-col gap-3 lg:order-2 lg:col-span-5 lg:col-start-8"
          >
            {aboutModelsPhotos.map((src, i) => (
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
                      ? "relative aspect-[4/3] w-[80%] overflow-hidden bg-ink/5"
                      : "relative aspect-[4/5] w-[68%] self-end overflow-hidden bg-ink/5"
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
        </div>
      </div>
    </section>
  )
}
