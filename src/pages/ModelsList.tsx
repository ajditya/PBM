import { useState } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"

import { femaleModels, maleModels } from "@/lib/placeholder-assets"
import ModelCard from "@/components/ModelCard"
import Pagination from "@/components/Pagination"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Screen 2 — Models Listing (Female / Male).
 *
 * Off-white. 60vh page header with massive "Women." / "Men." headline,
 * tracked eyebrow and inline filter rail (active link gold-underlined).
 * Below: asymmetric masonry of editorial portraits with B1 hover state.
 * Pagination "01 / 04" sits at the bottom above the global footer.
 * ──────────────────────────────────────────────────────────── */

const FILTERS = [
  "All",
  "New Faces",
  "Mainboard",
  "Development",
  "Digital",
] as const
type Filter = (typeof FILTERS)[number]

/** Cycled aspect ratios — the source of asymmetric tile heights. */
const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[3/5]",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[2/3]",
  "aspect-[3/4]",
  "aspect-[4/5]",
] as const

export default function ModelsList() {
  const { pathname } = useLocation()
  const isMale = pathname.endsWith("/male")
  const gender = isMale ? "Men" : "Women"
  const roster = isMale ? maleModels : femaleModels
  const [activeFilter, setActiveFilter] = useState<Filter>("All")

  const count = roster.length.toString().padStart(2, "0")

  return (
    <main className="bg-paper text-ink">
      {/* ─── Page header ─── */}
      <section
        aria-labelledby="models-heading"
        className="relative w-full"
      >
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1600px] flex-col justify-end px-6 pb-14 pt-36 sm:px-10 sm:pb-20 sm:pt-44 lg:px-14 lg:pb-24 lg:pt-56">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="mb-10 text-[11px] uppercase tracking-[0.32em] text-mute sm:mb-14"
          >
            01 — The Roster · {count} Talents
          </motion.p>

          <motion.h1
            id="models-heading"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: easeOutExpo,
              delay: 0.1,
            }}
            className="font-display font-light leading-[0.85] tracking-[-0.03em] text-[88px] sm:text-[140px] lg:text-[180px] xl:text-[200px]"
          >
            {gender}.
          </motion.h1>

          {/* ─── Filter bar (B3) ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: easeOutExpo,
              delay: 0.4,
            }}
            className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-hairline pt-8 sm:mt-16 sm:gap-x-10 sm:pt-10"
          >
            {FILTERS.map((f) => {
              const isActive = f === activeFilter
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`relative inline-flex h-6 items-center px-px text-[11px] uppercase tracking-[0.32em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "text-ink" : "text-mute hover:text-ink"
                  }`}
                  aria-pressed={isActive}
                >
                  {f}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              )
            })}

            <span className="ml-auto text-[10px] uppercase tracking-[0.32em] text-mute">
              {count} Results
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── Asymmetric masonry grid ─── */}
      <section
        aria-label={`${gender} roster`}
        className="mx-auto w-full max-w-[1600px] px-6 pb-12 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.0,
            ease: easeOutExpo,
            delay: 0.5,
          }}
          className="columns-2 gap-2 sm:columns-3 lg:columns-4"
          style={{ columnGap: "0.5rem" }}
        >
          {roster.map((m, i) => (
            <ModelCard
              key={m.slug}
              slug={m.slug}
              name={m.name}
              img={m.img}
              aspect={ASPECTS[i % ASPECTS.length]}
            />
          ))}
        </motion.div>
      </section>

      {/* ─── Pagination ─── */}
      <Pagination current={1} total={4} />
    </main>
  )
}
