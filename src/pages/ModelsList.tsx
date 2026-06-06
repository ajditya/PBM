import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"

import { getModels, publicUrl, type ModelGender } from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import ModelCard from "@/components/ModelCard"
import Pagination from "@/components/Pagination"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Screen 2 — Models Listing.
 *
 * Off-white. 60vh page header with a massive headline:
 *   /models         → "The Roster." (everyone, both genders)
 *   /models/female  → "Women."
 *   /models/male    → "Men."
 * Below: asymmetric masonry of editorial portraits with B1 hover state,
 * then real pagination derived from the live roster length.
 *
 * Roster comes from Supabase (getModels, optionally by gender). RLS keeps it
 * to published rows; ordering is sort_order → name.
 * ──────────────────────────────────────────────────────────── */

/** How many talents render per page before pagination kicks in. */
const PAGE_SIZE = 12

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
  // /models → everyone; /models/male → men; /models/female → women.
  const genderParam: ModelGender | undefined = pathname.endsWith("/male")
    ? "male"
    : pathname.endsWith("/female")
      ? "female"
      : undefined
  const heading =
    genderParam === "male" ? "Men" : genderParam === "female" ? "Women" : "The Roster"

  const { data, loading, error } = useAsyncData(
    () => getModels(genderParam),
    [genderParam],
  )
  const roster = data ?? []
  const count = roster.length.toString().padStart(2, "0")

  // Real pagination over the live roster.
  const [page, setPage] = useState(1)
  useEffect(() => setPage(1), [pathname]) // reset when switching board
  const totalPages = Math.max(1, Math.ceil(roster.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = roster.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goToPage = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
            {heading}.
          </motion.h1>
        </div>
      </section>

      {/* ─── Asymmetric masonry grid ─── */}
      <section
        aria-label={`${heading} roster`}
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
              : pageItems.map((m, i) => (
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

      {/* ─── Pagination (only when there's more than one page) ─── */}
      {!loading && totalPages > 1 && (
        <Pagination
          current={safePage}
          total={totalPages}
          onPrev={() => goToPage(Math.max(1, safePage - 1))}
          onNext={() => goToPage(Math.min(totalPages, safePage + 1))}
        />
      )}
    </main>
  )
}
