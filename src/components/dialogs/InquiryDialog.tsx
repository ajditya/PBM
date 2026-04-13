import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

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
}

function Field({ id, label, type = "text", textarea = false, disabled }: FieldProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 text-[10px] uppercase tracking-[0.32em] text-mute"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          disabled={disabled}
          className="resize-none border-0 border-b border-ink bg-transparent py-2 text-[14px] tracking-[0.02em] text-ink outline-none placeholder:text-mute/50 focus:border-gold disabled:cursor-not-allowed"
        />
      ) : (
        <input
          id={id}
          type={type}
          disabled={disabled}
          className="border-0 border-b border-ink bg-transparent py-2 text-[14px] tracking-[0.02em] text-ink outline-none placeholder:text-mute/50 focus:border-gold disabled:cursor-not-allowed"
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
  onOpenChange,
  initialState = "idle",
}: Props) {
  const [state, setState] = useState<InquiryState>(initialState)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setState("submitting")
    // Fake latency — flips to success after 1.4s. No real network call.
    window.setTimeout(() => setState("success"), 1400)
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
                  className="mt-8 font-display text-[36px] font-light leading-[1.05] tracking-[-0.01em]"
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
                  className="mt-6 max-w-[34ch] text-[14px] leading-[1.7] text-mute"
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
                <h2
                  id="inquiry-heading"
                  className="font-display text-[26px] font-light leading-[1.1] tracking-[-0.01em] sm:text-[28px]"
                >
                  Inquire about {modelName}
                </h2>
                <p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-mute">
                  Booking enquiry
                </p>

                {/* C4 error strip */}
                {state === "error" && (
                  <div className="mt-8 flex items-start justify-between gap-4 border-t border-b border-error/60 py-3 pl-4 pr-2">
                    <p className="text-[13px] leading-[1.6] text-error">
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
                  <Field id="iq-name" label="Your name" disabled={state === "submitting"} />
                  <Field id="iq-company" label="Company" disabled={state === "submitting"} />
                  <Field id="iq-email" label="Email" type="email" disabled={state === "submitting"} />
                  <Field id="iq-phone" label="Phone" type="tel" disabled={state === "submitting"} />
                  <Field
                    id="iq-details"
                    label="Project details"
                    textarea
                    disabled={state === "submitting"}
                  />
                  <Field id="iq-dates" label="Estimated dates" disabled={state === "submitting"} />

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
