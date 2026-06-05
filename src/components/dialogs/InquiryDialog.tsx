import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

import { createInquiry, isValidEmail } from "@/lib/supabase"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * InquiryDialog — Screen 3 booking modal.
 *
 * State machine: idle → submitting → success | error
 * - idle (C1): default form, six underline-only fields + black CTA
 * - submitting (C2): inputs dimmed + disabled, "SENDING…" with dots
 * - success (C3): replaces form with calm "Inquiry sent." panel
 * - error (C4): form still visible with red hairline error strip
 *
 * NO backend wiring — submit just transitions to "success" after a
 * fake delay. URL ?state= toggles initial state for screenshot review.
 * ──────────────────────────────────────────────────────────── */

export type InquiryState = "idle" | "submitting" | "success" | "error"

interface Props {
  open: boolean
  modelName: string
  /** Current model's id — written to inquiries.model_id. */
  modelId: string
  onOpenChange: (open: boolean) => void
  /** Demo override — used by `?state=` URL param. */
  initialState?: InquiryState
}

interface FieldProps {
  id: string
  label: string
  type?: string
  textarea?: boolean
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}

function Field({
  id,
  label,
  type = "text",
  textarea = false,
  disabled,
  value,
  onChange,
}: FieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="pbm-meta-label mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pbm-meta-value resize-none border-0 border-b border-ink bg-transparent py-2 outline-none placeholder:text-mute/50 focus:border-gold disabled:cursor-not-allowed"
        />
      ) : (
        <input
          id={id}
          type={type}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pbm-meta-value border-0 border-b border-ink bg-transparent py-2 outline-none placeholder:text-mute/50 focus:border-gold disabled:cursor-not-allowed"
        />
      )}
    </div>
  )
}

function SendingDots() {
  return (
    <span aria-hidden className="ml-3 inline-flex items-baseline gap-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: i === 1 ? [1, 1.4, 1] : [1, 1.15, 1],
          }}
          transition={{
            duration: 1.2,
            ease: easeOutExpo,
            repeat: Infinity,
            delay: i * 0.18,
          }}
          className="inline-block size-1 rounded-none bg-paper"
        />
      ))}
    </span>
  )
}

function InquiryDialogInner({
  open,
  modelName,
  modelId,
  onOpenChange,
  initialState = "idle",
}: Props) {
  const [state, setState] = useState<InquiryState>(initialState)

  // Controlled fields.
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [details, setDetails] = useState("")
  const [dates, setDates] = useState("")
  // Inline validation caption (distinct from the C4 network-error strip).
  const [validationMsg, setValidationMsg] = useState("")

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === "submitting") return

    // Client-side validation → inline hairline caption (not the C4 strip).
    if (!name.trim() || !email.trim() || !details.trim()) {
      setValidationMsg("Please add your name, email, and project details.")
      return
    }
    if (!isValidEmail(email)) {
      setValidationMsg("Please enter a valid email address.")
      return
    }

    setValidationMsg("")
    setState("submitting")
    try {
      // No .select() — anon has no SELECT policy on inquiries.
      await createInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        company: company.trim() || null,
        message: details.trim(),
        estimated_dates: dates.trim() || null,
        model_id: modelId,
      })
      setState("success")
    } catch {
      // Network/server failure → C4 error strip with the email fallback.
      setState("error")
    }
  }

  const close = () => onOpenChange(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="inquiry-dialog"
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeOutExpo }}
          aria-modal="true"
          role="dialog"
          aria-label={`Inquire about ${modelName}`}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={close}
            className="absolute inset-0 h-full w-full bg-ink/70"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{
              duration: 0.6,
              ease: easeOutExpo,
            }}
            className="relative z-10 w-full max-w-[480px] bg-paper px-8 py-12 text-ink shadow-none sm:px-10 sm:py-14"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-6 top-6 inline-flex h-8 w-8 items-center justify-center text-ink transition-opacity hover:opacity-60"
            >
              <X className="size-4" strokeWidth={1.25} />
            </button>

            {state === "success" ? (
              /* ─── C3 — Success ─── */
              <div className="flex flex-col items-start py-6">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: easeOutExpo,
                    delay: 0.1,
                  }}
                  className="h-px w-10 origin-left bg-gold"
                />
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: easeOutExpo,
                    delay: 0.2,
                  }}
                  className="pbm-display-s mt-8"
                >
                  Inquiry sent.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: easeOutExpo,
                    delay: 0.35,
                  }}
                  className="pbm-body mt-6 max-w-[34ch] text-mute"
                >
                  Our team will respond within 24 hours regarding {modelName}'s
                  availability.
                </motion.p>
                <button
                  type="button"
                  onClick={close}
                  className="pbm-link mt-12 text-ink"
                >
                  Continue browsing <span aria-hidden>→</span>
                </button>
              </div>
            ) : (
              /* ─── C1 / C2 / C4 — Form ─── */
              <>
                <h2 id="inquiry-heading" className="pbm-display-s">
                  Inquire about {modelName}
                </h2>
                <p className="pbm-meta-label mt-3">Booking enquiry</p>

                {/* C4 error strip */}
                {state === "error" && (
                  <div className="mt-8 flex items-start justify-between gap-4 border-t border-b border-error/60 py-3 pl-4 pr-2">
                    <p className="pbm-body text-error">
                      Something went wrong. Please try again or email{" "}
                      <a
                        href="mailto:bookings@prasadbidapa.com"
                        className="underline decoration-error underline-offset-2"
                      >
                        bookings@prasadbidapa.com
                      </a>{" "}
                      directly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setState("idle")}
                      aria-label="Dismiss error"
                      className="shrink-0 text-error hover:opacity-70"
                    >
                      <X className="size-4" strokeWidth={1.25} />
                    </button>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className={`mt-8 flex flex-col gap-6 transition-opacity duration-500 ${
                    state === "submitting" ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <Field
                    id="iq-name"
                    label="Your name"
                    disabled={state === "submitting"}
                    value={name}
                    onChange={setName}
                  />
                  <Field
                    id="iq-company"
                    label="Company"
                    disabled={state === "submitting"}
                    value={company}
                    onChange={setCompany}
                  />
                  <Field
                    id="iq-email"
                    label="Email"
                    type="email"
                    disabled={state === "submitting"}
                    value={email}
                    onChange={setEmail}
                  />
                  <Field
                    id="iq-phone"
                    label="Phone"
                    type="tel"
                    disabled={state === "submitting"}
                    value={phone}
                    onChange={setPhone}
                  />
                  <Field
                    id="iq-details"
                    label="Project details"
                    textarea
                    disabled={state === "submitting"}
                    value={details}
                    onChange={setDetails}
                  />
                  <Field
                    id="iq-dates"
                    label="Estimated dates"
                    disabled={state === "submitting"}
                    value={dates}
                    onChange={setDates}
                  />

                  {validationMsg && (
                    <p role="alert" className="text-[11px] text-error">
                      {validationMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="pbm-bar mt-4 disabled:cursor-not-allowed"
                  >
                    {state === "submitting" ? (
                      <>
                        Sending
                        <SendingDots />
                      </>
                    ) : (
                      <>
                        Send inquiry <span aria-hidden className="ml-3">→</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Public wrapper — keys the inner dialog by `${open}-${initialState}` so
 * the form state machine resets cleanly each time the dialog re-opens or
 * the demo `?state=` URL param changes, without needing setState in an
 * effect.
 */
export default function InquiryDialog(props: Props) {
  return (
    <InquiryDialogInner
      key={`${props.open}-${props.initialState ?? "idle"}`}
      {...props}
    />
  )
}
