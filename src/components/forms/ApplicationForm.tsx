import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import StepIndicator from "@/components/forms/StepIndicator"
import PhotoUploadStep from "@/components/forms/PhotoUploadStep"
import ApplicationSuccess from "@/components/forms/ApplicationSuccess"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Multi-step Become a Model application.
 *
 * Four steps + success screen. UI only — no validation library,
 * no submit handler, no Supabase. Local state machine drives
 * step navigation and a small amount of in-memory form state.
 *
 *   Step 1 — Personal     (name, email, phone, age, gender, city, ig)
 *   Step 2 — Measurements (height, bust, waist, hips, shoes, hair, eyes)
 *   Step 3 — Photos       (PhotoUploadStep — empty/uploading/error)
 *   Step 4 — Review       (two-col summary table)
 *   Success — D3 screen
 *
 * One demo error caption is rendered on the email field of Step 1
 * (when value contains "@" but no "." — D4 spec) so the validation
 * visual state is verifiable without a real validator.
 * ──────────────────────────────────────────────────────────── */

type FormData = {
  fullName: string
  email: string
  phone: string
  age: string
  gender: "Female" | "Male" | "Non-binary" | ""
  city: string
  instagram: string
  height: string
  bust: string
  waist: string
  hips: string
  shoes: string
  hair: string
  eyes: string
}

const INITIAL: FormData = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  city: "",
  instagram: "",
  height: "",
  bust: "",
  waist: "",
  hips: "",
  shoes: "",
  hair: "",
  eyes: "",
}

/* ─── Field wrapper — tracked label, underline input, optional error caption ─── */
interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  const isError = !!error
  return (
    <div className="flex flex-col">
      <label
        htmlFor={htmlFor}
        className={`pbm-meta-label mb-2 transition-colors ${
          isError ? "text-error" : ""
        }`}
      >
        {label}
      </label>
      {children}
      {isError && (
        <p className="mt-2 text-[11px] text-error">{error}</p>
      )}
    </div>
  )
}

export default function ApplicationForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [data, setData] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  // Lightweight email demo validation — D4 visual state proof
  const emailLooksWrong =
    data.email.length > 0 && !(data.email.includes("@") && data.email.includes("."))

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const goNext = () => setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s))
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))

  if (submitted) {
    return <ApplicationSuccess firstName={data.fullName.split(" ")[0]} />
  }

  return (
    <section
      aria-label="Become a Model application"
      className="bg-paper py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[720px] px-6 sm:px-8">
        <StepIndicator current={step} />

        <div className="mt-16 sm:mt-20">
          <AnimatePresence mode="wait">
            {/* ─── Step 1 — Personal ─── */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="space-y-10"
              >
                <header>
                  <p className="pbm-eyebrow">
                    01 — Personal
                  </p>
                  <h2 className="pbm-display-s mt-4">
                    Tell us who you are.
                  </h2>
                </header>

                <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                  <Field label="Full Name" htmlFor="fullName">
                    <Input
                      id="fullName"
                      value={data.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="Aisha Khanna"
                    />
                  </Field>

                  <Field
                    label="Email"
                    htmlFor="email"
                    error={
                      emailLooksWrong
                        ? "Please enter a valid email address."
                        : undefined
                    }
                  >
                    <Input
                      id="email"
                      type="email"
                      aria-invalid={emailLooksWrong || undefined}
                      value={data.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="aisha@example.com"
                    />
                  </Field>

                  <Field label="Phone" htmlFor="phone">
                    <Input
                      id="phone"
                      type="tel"
                      value={data.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 80 0000 0000"
                    />
                  </Field>

                  <Field label="Age" htmlFor="age">
                    <Input
                      id="age"
                      type="number"
                      inputMode="numeric"
                      min={14}
                      max={80}
                      placeholder="e.g. 22"
                      value={data.age}
                      onChange={(e) => update("age", e.target.value)}
                    />
                  </Field>

                  <Field label="Gender" htmlFor="gender">
                    <div
                      id="gender"
                      role="radiogroup"
                      className="pbm-meta-value flex flex-wrap gap-6 pt-3"
                    >
                      {(["Female", "Male", "Non-binary"] as const).map((g) => {
                        const isActive = data.gender === g
                        return (
                          <button
                            key={g}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => update("gender", g)}
                            className="group flex items-center gap-3"
                          >
                            <span
                              aria-hidden
                              className={`relative h-3 w-3 border border-ink ${
                                isActive ? "bg-ink" : "bg-transparent"
                              }`}
                            />
                            <span className="text-ink">{g}</span>
                          </button>
                        )
                      })}
                    </div>
                  </Field>

                  <Field label="City" htmlFor="city">
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Bengaluru"
                    />
                  </Field>

                  <Field label="Instagram Handle" htmlFor="instagram">
                    <Input
                      id="instagram"
                      value={data.instagram}
                      onChange={(e) => update("instagram", e.target.value)}
                      placeholder="@aisha"
                    />
                  </Field>
                </div>
              </motion.div>
            )}

            {/* ─── Step 2 — Measurements ─── */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="space-y-10"
              >
                <header>
                  <p className="pbm-eyebrow">
                    02 — Measurements
                  </p>
                  <h2 className="pbm-display-s mt-4">
                    The numbers.
                  </h2>
                </header>

                <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                  <Field label="Height (cm)" htmlFor="height">
                    <Input
                      id="height"
                      value={data.height}
                      onChange={(e) => update("height", e.target.value)}
                      placeholder="178"
                    />
                  </Field>
                  <Field label="Bust / Chest (cm)" htmlFor="bust">
                    <Input
                      id="bust"
                      value={data.bust}
                      onChange={(e) => update("bust", e.target.value)}
                      placeholder="84"
                    />
                  </Field>
                  <Field label="Waist (cm)" htmlFor="waist">
                    <Input
                      id="waist"
                      value={data.waist}
                      onChange={(e) => update("waist", e.target.value)}
                      placeholder="60"
                    />
                  </Field>
                  <Field label="Hips (cm)" htmlFor="hips">
                    <Input
                      id="hips"
                      value={data.hips}
                      onChange={(e) => update("hips", e.target.value)}
                      placeholder="89"
                    />
                  </Field>
                  <Field label="Shoes (EU)" htmlFor="shoes">
                    <Input
                      id="shoes"
                      value={data.shoes}
                      onChange={(e) => update("shoes", e.target.value)}
                      placeholder="39"
                    />
                  </Field>
                  <Field label="Hair" htmlFor="hair">
                    <Input
                      id="hair"
                      value={data.hair}
                      onChange={(e) => update("hair", e.target.value)}
                      placeholder="Black"
                    />
                  </Field>
                  <Field label="Eyes" htmlFor="eyes">
                    <Input
                      id="eyes"
                      value={data.eyes}
                      onChange={(e) => update("eyes", e.target.value)}
                      placeholder="Brown"
                    />
                  </Field>
                </div>
              </motion.div>
            )}

            {/* ─── Step 3 — Photos ─── */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="space-y-10"
              >
                <header>
                  <p className="pbm-eyebrow">
                    03 — Photos
                  </p>
                  <h2 className="pbm-display-s mt-4">
                    Show us your face.
                  </h2>
                </header>

                <PhotoUploadStep />
              </motion.div>
            )}

            {/* ─── Step 4 — Review ─── */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="space-y-10"
              >
                <header>
                  <p className="pbm-eyebrow">
                    04 — Review
                  </p>
                  <h2 className="pbm-display-s mt-4">
                    Final look.
                  </h2>
                </header>

                <ReviewSummary data={data} />

                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="pbm-bar"
                >
                  Submit Application <span aria-hidden className="ml-3">→</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Step navigation (hidden on success) ── */}
        {step < 4 && (
          <div className="mt-16 flex items-center justify-between border-t border-hairline pt-8">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="pbm-eyebrow text-ink transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span aria-hidden className="mr-2">←</span> Back
            </button>

            <button
              type="button"
              onClick={goNext}
              className="pbm-eyebrow text-ink"
            >
              Continue <span aria-hidden className="ml-2">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Review summary table — Step 4 internal ─── */
function ReviewSummary({ data }: { data: FormData }) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Full Name", value: data.fullName || "—" },
    { label: "Email", value: data.email || "—" },
    { label: "Phone", value: data.phone || "—" },
    { label: "Age", value: data.age || "—" },
    { label: "Gender", value: data.gender || "—" },
    { label: "City", value: data.city || "—" },
    { label: "Instagram", value: data.instagram || "—" },
    { label: "Height", value: data.height ? `${data.height} cm` : "—" },
    { label: "Bust / Chest", value: data.bust || "—" },
    { label: "Waist", value: data.waist || "—" },
    { label: "Hips", value: data.hips || "—" },
    { label: "Shoes", value: data.shoes || "—" },
    { label: "Hair", value: data.hair || "—" },
    { label: "Eyes", value: data.eyes || "—" },
    { label: "Photos", value: "4 uploaded" },
  ]

  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3"
        >
          <dt className="pbm-meta-label">
            {r.label}
          </dt>
          <dd className="pbm-meta-value text-right">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
