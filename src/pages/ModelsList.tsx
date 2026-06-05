import { useState } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"

import { getModels, publicUrl } from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
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
 *
 * B2: roster now comes from Supabase (getModels by gender). RLS keeps it to
 * published rows; ordering is sort_order → name. UI is unchanged.
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

/** Inline shimmer for the header count tokens while data loads. */
function CountToken({ loading, value }: { loading: boolean; value: string }) {
  if (loading)
    return (
      <span
        aria-hidden
        className="inline-block h-[0.8em] w-7 translate-y-[0.05em] animate-pulse bg-ink/10 align-baseline"
      />
    )
  return <>{value}</>
}

/** Skeleton tile matching ModelCard's masonry footprint. */
function SkeletonTile({ aspect }: { aspect: string }) {
  return (
    <div className="mb-2 block break-inside-avoid">
      <div className={`w-full animate-pulse bg-ink/5 ${aspect}`} />
      <div className="mt-4 pb-2">
        <div className="h-5 w-24 animate-pulse bg-ink/5" />
        <div className="mt-3 h-3 w-12 animate-pulse bg-ink/5" />
      </div>
    </div>
  )
}

export default function ModelsList() {
  const { pathname } = useLocation()
  const isMale = pathname.endsWith("/male")
  const gender = isMale ? "Men" : "Women"
  const [activeFilter, setActiveFilter] = useState<Filter>("All")

  const { data, loading, error } = useAsyncData(
    () => getModels(isMale ? "male" : "female"),
    [isMale],
  )
  const roster = data ?? []
  const count = roster.length.toString().padStart(2, "0")

  return (
    <main className="bg-paper text-ink">
      {/* ─── Page header ─── */}
      <section aria-labelledby="models-heading" className="relative w-full">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1600px] flex-col justify-end px-6 pb-14 pt-36 sm:px-10 sm:pb-20 sm:pt-44 lg:px-14 lg:pb-24 lg:pt-56">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="pbm-eyebrow-mute mb-10 sm:mb-14"
          >
            01 — The Roster · <CountToken loading={loading} value={count} /> Talents
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
            className="pbm-display-xl"
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
                  className={`pbm-ui relative inline-flex h-6 items-center px-px transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

            <span className="pbm-meta-label ml-auto">
              <CountToken loading={loading} value={count} /> Results
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── Asymmetric masonry grid ─── */}
      <section
        aria-label={`${gender} roster`}
        className="mx-auto w-full max-w-[1600px] px-6 pb-12 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24"
      >
        {error ? (
          <p className="pbm-meta-label text-mute">
            The roster couldn’t be loaded. Please refresh.
          </p>
        ) : !loading && roster.length === 0 ? (
          <p className="pbm-meta-label text-mute">No talents listed yet.</p>
        ) : (
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
            {loading
              ? ASPECTS.map((aspect, i) => (
                  <SkeletonTile key={i} aspect={aspect} />
                ))
              : roster.map((m, i) => (
                  <ModelCard
                    key={m.slug}
                    slug={m.slug}
                    name={m.name}
                    img={publicUrl(m.cover_image)}
                    aspect={ASPECTS[i % ASPECTS.length]}
                  />
                ))}
          </motion.div>
        )}
      </section>

      {/* ─── Pagination ─── */}
      <Pagination current={1} total={4} />
    </main>
  )
}
