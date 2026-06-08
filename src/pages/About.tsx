import { motion } from "framer-motion"

import AboutAssociates from "@/components/sections/AboutAssociates"
import AboutFounder from "@/components/sections/AboutFounder"
import AboutModels from "@/components/sections/AboutModels"
import AboutTeam from "@/components/sections/AboutTeam"
import { useSiteContent } from "@/lib/site-media-context"
import { DEFAULT_ABOUT_COPY } from "@/lib/about-copy"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Screen 5 — About.
 *
 * Hero (80vh, off-white) + 4 stacked sections:
 *   01 The Models
 *   02 The Associates
 *      The Founder (full-bleed dark)
 *   03 The Team (real team grid)
 * ──────────────────────────────────────────────────────────── */

function AboutHero() {
  const { hero } = useSiteContent("about_copy", DEFAULT_ABOUT_COPY)

  return (
    <section
      aria-label="About — A house of fashion, talent and craft"
      className="relative flex min-h-[80vh] items-end bg-paper text-ink"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-32 sm:px-10 sm:pb-24 sm:pt-40 lg:px-14 lg:pb-32 lg:pt-48">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo }}
          className="pbm-eyebrow mb-12"
        >
          Est. 1985 · Bengaluru · India
        </motion.p>

        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.1 }}
            className="pbm-display-l whitespace-pre-line lg:col-span-8"
          >
            {hero.headline}
          </motion.h1>

          {/* Right-aligned manifesto */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.4 }}
            className="lg:col-span-4 lg:col-start-9 lg:pt-12"
          >
            <p className="pbm-body max-w-[36ch]">{hero.manifesto}</p>
          </motion.div>
        </div>

        {/* Bottom hairline + scroll cue */}
        <div className="mt-20 flex items-end justify-between border-t border-hairline pt-6 sm:mt-28 lg:mt-36">
          <p className="pbm-meta-label">
            The House — Models · Associates · Founder · Team
          </p>
          <span aria-hidden className="pbm-meta-label hidden sm:inline">
            Scroll ↓
          </span>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <main className="bg-paper text-ink">
      <AboutHero />
      <AboutModels />
      <AboutAssociates />
      <AboutFounder />
      <AboutTeam />
    </main>
  )
}
