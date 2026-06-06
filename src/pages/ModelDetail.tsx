import { useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import { getModelBySlug, publicUrl, type ModelRow } from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
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
 *
 * B2: model + gallery now come from Supabase (getModelBySlug). The
 * gallery feeds the slider in sort_order (slide 1 = primary). UI is
 * unchanged; board renders upper-cased by the eyebrow style.
 * ──────────────────────────────────────────────────────────── */

const STAT_ROWS: ReadonlyArray<{ label: string; key: keyof ModelRow; unit?: true }> = [
  { label: "Height", key: "height", unit: true },
  { label: "Bust", key: "bust", unit: true },
  { label: "Waist", key: "waist", unit: true },
  { label: "Hips", key: "hips", unit: true },
  { label: "Hair", key: "hair" },
  { label: "Eyes", key: "eyes" },
  { label: "Shoes", key: "shoes" },
  { label: "Location", key: "location" },
]

export default function ModelDetail() {
  const { slug = "" } = useParams()
  const [searchParams] = useSearchParams()

  const { data: model, loading, error } = useAsyncData(
    () => getModelBySlug(slug),
    [slug],
  )

  // Dev-only state preview via ?state=submitting|success|error
  const previewedState = searchParams.get("state") as InquiryState | null
  const [dialogOpen, setDialogOpen] = useState<boolean>(!!previewedState)

  // Slider source — primary image is always slide 1 (gallery sort_order). Hook
  // is called unconditionally; while loading we render a skeleton instead.
  const gallery = model?.gallery?.length
    ? model.gallery.map((g) => publicUrl(g.image_path))
    : model?.cover_image
      ? [publicUrl(model.cover_image)]
      : undefined
  const slider = useEditorialSlider(gallery)

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="bg-paper text-ink">
        <section className="relative w-full pt-[144px] pb-16 sm:pt-[160px] sm:pb-20 lg:pt-[176px] lg:pb-24">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10 lg:px-14">
            <div className="order-1 flex flex-col lg:col-span-5 lg:col-start-1 lg:row-start-1">
              <div className="mb-10 h-3 w-40 animate-pulse bg-ink/10" />
              <div className="h-16 w-3/4 animate-pulse bg-ink/5 sm:h-20" />
              <div aria-hidden className="mt-12 h-px w-16 bg-gold" />
            </div>
            <div className="order-2 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-4">
              <div className="mx-auto aspect-[5/7] w-full max-w-[420px] animate-pulse bg-ink/5 lg:ml-auto lg:mr-0" />
            </div>
            <div className="order-4 grid grid-cols-2 gap-x-10 gap-y-5 lg:col-span-5 lg:col-start-1 lg:row-start-3">
              {STAT_ROWS.map(({ label }) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3"
                >
                  <span className="h-2.5 w-12 animate-pulse bg-ink/10" />
                  <span className="h-2.5 w-10 animate-pulse bg-ink/5" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  /* ── Error / not found ── */
  if (error || !model) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-8 text-ink">
        <div className="text-center">
          <p className="pbm-eyebrow-mute mb-6">
            {error ? "Something went wrong" : "Model not found"}
          </p>
          <h1 className="pbm-display-m">
            {error ? "Please refresh the page." : "That talent is off-roster."}
          </h1>
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

  const genderLabel = model.gender === "male" ? "Men" : "Women"
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
            <p className="pbm-eyebrow-mute mb-10">{genderLabel}</p>

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
            {STAT_ROWS.map(({ label, key, unit }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3"
              >
                <dt className="pbm-meta-label">{label}</dt>
                <dd className="pbm-meta-value">
                  {model[key] ?? "—"}
                  {model[key] && unit ? ` ${model.measurements_unit ?? ""}` : ""}
                </dd>
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
        modelId={model.id}
        onOpenChange={setDialogOpen}
        initialState={previewedState ?? "idle"}
      />
    </main>
  )
}
