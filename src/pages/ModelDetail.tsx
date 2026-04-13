import { useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import { findModelBySlug } from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"
import EditorialGallery from "@/components/EditorialGallery"
import EditorialSlider from "@/components/EditorialSlider"
import InquiryDialog, {
  type InquiryState,
} from "@/components/dialogs/InquiryDialog"

/* ────────────────────────────────────────────────────────────
 * Screen 3 — Model Detail page.
 *
 * 60/40 split hero (left full-bleed editorial portrait, right
 * off-white panel with name + stats + CTA), an asymmetric
 * editorial gallery below, and the inquiry dialog wired to the
 * "INQUIRE ABOUT THIS MODEL" CTA.
 * ──────────────────────────────────────────────────────────── */

const STAT_ROWS: ReadonlyArray<{ label: string; key: keyof Model["stats"] }> = [
  { label: "Height", key: "height" },
  { label: "Bust", key: "bust" },
  { label: "Waist", key: "waist" },
  { label: "Hips", key: "hips" },
  { label: "Hair", key: "hair" },
  { label: "Eyes", key: "eyes" },
  { label: "Shoes", key: "shoes" },
  { label: "Location", key: "location" },
]

type Model = NonNullable<ReturnType<typeof findModelBySlug>>["model"]

export default function ModelDetail() {
  const { slug = "" } = useParams()
  const [searchParams] = useSearchParams()
  const found = useMemo(() => findModelBySlug(slug), [slug])

  // Dev-only state preview via ?state=submitting|success|error
  const previewedState = searchParams.get("state") as InquiryState | null
  const [dialogOpen, setDialogOpen] = useState<boolean>(!!previewedState)

  if (!found) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-8 text-ink">
        <div className="text-center">
          <p className="pbm-eyebrow-mute mb-6">Model not found</p>
          <h1 className="pbm-display-m">That talent is off-roster.</h1>
          <Link
            to="/models/female"
            className="pbm-link mt-12 inline-flex text-ink"
          >
            View the roster <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    )
  }

  const { model, gender } = found
  const [first, ...rest] = model.name.split(" ")
  const last = rest.join(" ")

  return (
    <main className="bg-paper text-ink">
      {/* ─── Hero — compact two-column ─── */}
      <section
        aria-label={`${model.name} — overview`}
        className="relative w-full pt-[144px] pb-16 sm:pt-[160px] sm:pb-20 lg:pt-[176px] lg:pb-24"
      >
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14">
          {/* ── Portrait — constrained, matches 5:7 source aspect ── */}
          <motion.figure
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: easeOutExpo }}
            className="relative mx-auto aspect-[5/7] w-full max-w-[380px] overflow-hidden bg-ink/5 lg:col-span-5 lg:max-w-none"
          >
            <motion.img
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.0, ease: easeOutExpo }}
              src={model.img}
              alt={`${model.name} editorial portrait`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.figure>

          {/* ── Meta panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.15 }}
            className="flex flex-col lg:col-span-7 lg:pt-6"
          >
            <p className="pbm-eyebrow-mute mb-10">
              {gender} · {model.stats.board}
            </p>

            <h1 className="pbm-display-m">
              {first}
              {last && (
                <>
                  <br />
                  {last}
                </>
              )}
            </h1>

            {/* Thin gold divider */}
            <div
              aria-hidden
              className="mt-12 h-px w-16 bg-gold"
            />

            {/* Stats table — two columns */}
            <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-5">
              {STAT_ROWS.map(({ label, key }) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3"
                >
                  <dt className="pbm-meta-label">{label}</dt>
                  <dd className="pbm-meta-value">{model.stats[key]}</dd>
                </div>
              ))}
            </dl>

            {/* CTA bar */}
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="pbm-bar mt-12"
            >
              Inquire about this model <span aria-hidden className="ml-3">→</span>
            </button>

            {/* Download digitals link */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="pbm-link mt-8 self-start text-ink"
            >
              Download digitals <span aria-hidden>↓</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── Editorial gallery ───
       * A/B comparison: female model pages render the asymmetric
       * stacked gallery; male model pages render the slider lookbook.
       * Once the user picks one, this conditional collapses. */}
      {gender === "Men" ? (
        <EditorialSlider pool={model.gallery} />
      ) : (
        <EditorialGallery pool={model.gallery} />
      )}

      {/* ─── Inquiry Dialog ─── */}
      <InquiryDialog
        open={dialogOpen}
        modelName={model.name}
        onOpenChange={setDialogOpen}
        initialState={previewedState ?? "idle"}
      />
    </main>
  )
}
