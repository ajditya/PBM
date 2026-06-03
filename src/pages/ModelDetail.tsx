import { useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import { findModelBySlug, modelGalleryPool } from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"
import { SliderStage, SliderControls } from "@/components/EditorialSlider"
import { useEditorialSlider } from "@/hooks/useEditorialSlider"
import InquiryDialog, {
  type InquiryState,
} from "@/components/dialogs/InquiryDialog"

/* ────────────────────────────────────────────────────────────
 * Screen 3 — Model Detail page.
 *
 * One cohesive top fold. The preview photo (slider stage) is the
 * primary visual on the right (~6 cols, first slide = the model's
 * primary image). The left column (~5 cols) stacks the name, the
 * slider navigation (counter + thumbnail rail), the measurements,
 * and the "INQUIRE ABOUT THIS MODEL" CTA. On mobile it stacks:
 * name → photo → nav → measurements → CTA.
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

  // Slider source — primary image is always slide 1. Models with a
  // real gallery already lead with their primary shot; the rest seed
  // the primary portrait ahead of the shared editorial pool. Computed
  // before the early return so the slider hook is called unconditionally.
  const gallery = found
    ? found.model.gallery ?? [found.model.img, ...modelGalleryPool]
    : undefined
  const slider = useEditorialSlider(gallery)

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
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10 lg:px-14">
          {/* ── Header — eyebrow, name, gold divider (left, top) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easeOutExpo }}
            className="order-1 flex flex-col lg:col-span-5 lg:col-start-1 lg:row-start-1"
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
            <div aria-hidden className="mt-12 h-px w-16 bg-gold" />
          </motion.div>

          {/* ── Preview photo — the primary visual (right) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: easeOutExpo }}
            className="order-2 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-4"
          >
            <SliderStage
              state={slider}
              className="mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0"
            />
          </motion.div>

          {/* ── Slider navigation (left, beneath the name) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.15 }}
            className="order-3 lg:col-span-5 lg:col-start-1 lg:row-start-2"
          >
            <SliderControls state={slider} />
          </motion.div>

          {/* ── Measurements (left, below the slider) ── */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.2 }}
            className="order-4 grid grid-cols-2 gap-x-10 gap-y-5 lg:col-span-5 lg:col-start-1 lg:row-start-3"
          >
            {STAT_ROWS.map(({ label, key }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3"
              >
                <dt className="pbm-meta-label">{label}</dt>
                <dd className="pbm-meta-value">{model.stats[key]}</dd>
              </div>
            ))}
          </motion.dl>

          {/* ── CTA bar (left, last) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.25 }}
            className="order-5 lg:col-span-5 lg:col-start-1 lg:row-start-4"
          >
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="pbm-bar"
            >
              Inquire about this model <span aria-hidden className="ml-3">→</span>
            </button>
          </motion.div>
        </div>
      </section>

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
