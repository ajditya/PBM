import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import StepIndicator from "@/components/forms/StepIndicator"
import PhotoUploadStep, { MIN_PHOTOS } from "@/components/forms/PhotoUploadStep"
import ApplicationSuccess from "@/components/forms/ApplicationSuccess"
import {
  createApplication,
  isValidEmail,
  signApplicationUploads,
  supabase,
  type ApplicationInsert,
} from "@/lib/supabase"
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

/** Map the form's gender labels onto the application_gender enum. */
function mapGender(g: FormData["gender"]): ApplicationInsert["gender"] {
  if (g === "Female") return "female"
  if (g === "Male") return "male"
  return "other"
}

/** Already-uploaded photos, retained so an insert failure can retry the row
 *  write without re-uploading (the photos are already in the private bucket). */
interface UploadedPhotos {
  applicationId: string
  paths: string[]
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
  const [photos, setPhotos] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  // Set once photos are in the bucket but before the row write succeeds.
  const [uploaded, setUploaded] = useState<UploadedPhotos | null>(null)

  // Inline email validation (also gates submit).
  const emailLooksWrong = data.email.length > 0 && !isValidEmail(data.email)

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const goNext = () => setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s))
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))

  const handleSubmit = async () => {
    if (status === "submitting") return

    // Client-side validation before any network call.
    const missing: string[] = []
    if (!data.fullName.trim()) missing.push("your name")
    if (!isValidEmail(data.email)) missing.push("a valid email")
    if (!data.phone.trim()) missing.push("a phone number")
    if (!data.gender) missing.push("your gender")
    if (missing.length) {
      setStatus("error")
      setErrorMsg(`Please add ${missing.join(", ")} before submitting.`)
      return
    }
    if (photos.length < MIN_PHOTOS) {
      setStatus("error")
      setErrorMsg(`Please add at least ${MIN_PHOTOS} photos before submitting.`)
      return
    }

    setStatus("submitting")
    setErrorMsg("")

    // Snapshot any prior successful upload so a retry skips re-uploading.
    let done = uploaded
    try {
      if (!done) {
        // 1. Ask the Edge Function for signed upload URLs (it validates first).
        const { applicationId, uploads } = await signApplicationUploads(
          photos.map((f) => ({ name: f.name, type: f.type, size: f.size })),
        )
        // 2. Upload each file straight to its signed URL (private bucket).
        for (let i = 0; i < uploads.length; i++) {
          const { path, token } = uploads[i]
          const { error } = await supabase.storage
            .from("applications")
            .uploadToSignedUrl(path, token, photos[i])
          if (error) throw error
        }
        done = { applicationId, paths: uploads.map((u) => u.path) }
        // Retain so an insert failure below doesn't orphan-then-re-upload.
        setUploaded(done)
      }

      // 3. Insert the application row. No .select() — anon has no SELECT policy.
      //    id = applicationId so the row id matches the photo folder prefix.
      await createApplication({
        id: done.applicationId,
        name: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        age: data.age ? Number(data.age) : null,
        gender: mapGender(data.gender),
        location: data.city.trim() || null,
        instagram: data.instagram.trim() || null,
        height: data.height.trim() || null,
        bust: data.bust.trim() || null,
        waist: data.waist.trim() || null,
        hips: data.hips.trim() || null,
        shoes: data.shoes.trim() || null,
        hair: data.hair.trim() || null,
        eyes: data.eyes.trim() || null,
        photo_paths: done.paths,
      })
      setSubmitted(true)
    } catch {
      setStatus("error")
      // If `done` is set, photos are already in the bucket — retry only the row
      // write (orphaned photos are possible if the applicant abandons here; a
      // cleanup job can sweep folders with no matching row later).
      setErrorMsg(
        done
          ? "Your photos uploaded, but saving your application failed. Please try again — we won't re-upload."
          : "Something went wrong submitting your application. Please try again.",
      )
    }
  }

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

                <PhotoUploadStep
                  files={photos}
                  onChange={setPhotos}
                  disabled={status === "submitting"}
                />
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

                <ReviewSummary data={data} photoCount={photos.length} />

                {status === "error" && (
                  <p role="alert" className="text-[11px] text-error">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === "submitting"}
                  className="pbm-bar disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    "Submitting…"
                  ) : (
                    <>
                      {uploaded ? "Retry submission" : "Submit Application"}{" "}
                      <span aria-hidden className="ml-3">→</span>
                    </>
                  )}
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
function ReviewSummary({ data, photoCount }: { data: FormData; photoCount: number }) {
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
    {
      label: "Photos",
      value: photoCount > 0 ? `${photoCount} selected` : "—",
    },
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
