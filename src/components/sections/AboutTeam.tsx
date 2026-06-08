import { motion } from "framer-motion"

import { useSiteContent } from "@/lib/site-media-context"
import { DEFAULT_ABOUT_COPY } from "@/lib/about-copy"
import { DEFAULT_TEAM_MEMBERS, teamImageSrc } from "@/lib/team-members"
import { fadeUp, viewportDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * About — Section 5: The Team.
 *
 * Off-white. Asymmetric grid of eight team members. Each card
 * is a portrait + Playfair name + tracked-caps role label.
 * Slight asymmetric column offsets keep it from reading as a
 * uniform 4-up.
 * ──────────────────────────────────────────────────────────── */

export default function AboutTeam() {
  const { team } = useSiteContent("about_copy", DEFAULT_ABOUT_COPY)
  const { members } = useSiteContent("team_members", DEFAULT_TEAM_MEMBERS)

  return (
    <section
      aria-label="The Team"
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
            03 — The Studio
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="pbm-display-m lg:col-span-7"
          >
            {team.heading}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="pbm-body max-w-[42ch] lg:col-span-4 lg:col-start-9 lg:pt-6"
          >
            {team.description}
          </motion.p>
        </motion.div>

        {/* ── Team grid — three core members with bios ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3 lg:gap-x-12"
        >
          {members.map((m) => (
            <motion.figure
              key={m.id}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
                {teamImageSrc(m) && (
                  <img
                    src={teamImageSrc(m)}
                    alt={`${m.name} portrait`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover grayscale"
                  />
                )}
              </div>
              <figcaption className="mt-6 flex flex-col">
                <p className="pbm-display-xs text-ink">{m.name}</p>
                <p className="pbm-meta-label mt-3">{m.role}</p>
                <p className="pbm-body mt-5 text-ink/70">{m.bio}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
