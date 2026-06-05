import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createInquiry, isValidEmail } from "@/lib/supabase"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Contact form (Screen 7).
 *
 * 640px max-width centered. Underline-only inputs for Name /
 * Email / Subject (custom text+chevron dropdown — NOT a native
 * select) / Message (textarea), then the SEND MESSAGE black bar.
 *
 * G1 success state replaces the form on submit. G2 dropdown
 * panel matches the visual-system spec — hairline divided rows,
 * tinted hover, gold "→" arrow on hover.
 *
 * UI only — no backend, no validation library.
 * ──────────────────────────────────────────────────────────── */

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Booking Request",
  "Press & Media",
  "Become a Model",
] as const

type Subject = (typeof SUBJECT_OPTIONS)[number]

interface FieldShellProps {
  label: string
  htmlFor?: string
  children: React.ReactNode
}

function FieldShell({ label, htmlFor, children }: FieldShellProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={htmlFor} className="pbm-meta-label mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState<Subject | "">("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside closes dropdown
  useEffect(() => {
    if (!dropdownOpen) return
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [dropdownOpen])

  const reset = () => {
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setSubmitted(false)
    setStatus("idle")
    setErrorMsg("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "submitting") return

    // Client-side validation before the network call.
    if (!name.trim() || !email.trim() || !subject || !message.trim()) {
      setStatus("error")
      setErrorMsg("Please complete every field before sending.")
      return
    }
    if (!isValidEmail(email)) {
      setStatus("error")
      setErrorMsg("Please enter a valid email address.")
      return
    }

    setStatus("submitting")
    setErrorMsg("")
    try {
      // No .select() — anon has no SELECT policy on inquiries.
      await createInquiry({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
        model_id: null,
      })
      setSubmitted(true)
    } catch {
      setStatus("error")
      setErrorMsg(
        "Something went wrong. Please try again or write to hello@prasadbidapa.com directly.",
      )
    }
  }

  return (
    <section
      aria-label="Send us a message"
      className="bg-paper py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[640px] px-6 sm:px-8">
        <header className="mb-14">
          <p className="pbm-eyebrow">Or send a message</p>
          <h2 className="pbm-display-m mt-4">Write to the studio.</h2>
        </header>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* ─── G1 — success state ─── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
              className="py-12 text-left"
            >
              <motion.div
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: easeOutExpo }}
                className="h-px w-10 origin-left bg-gold"
              />
              <h3 className="pbm-display-s mt-8">Message received.</h3>
              <p className="pbm-body mt-6 max-w-[44ch]">
                We respond to every inquiry within forty-eight hours.
              </p>
              <button
                type="button"
                onClick={reset}
                className="pbm-link mt-12 inline-flex text-ink"
              >
                Send another message <span aria-hidden>→</span>
              </button>
            </motion.div>
          ) : (
            /* ─── Form ─── */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-10"
            >
              <FieldShell label="Name" htmlFor="contact-name">
                <Input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </FieldShell>

              <FieldShell label="Email" htmlFor="contact-email">
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </FieldShell>

              {/* ─── Custom Subject dropdown (G2) ─── */}
              <FieldShell label="Subject">
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    className="pbm-meta-value flex w-full items-center justify-between border-b border-ink py-3 text-left"
                  >
                    <span className={subject ? "" : "text-mute font-light"}>
                      {subject || "Choose a subject"}
                    </span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: easeOutExpo }}
                      className="text-[14px] text-ink"
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: easeOutExpo }}
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-10 border border-ink bg-paper"
                      >
                        {SUBJECT_OPTIONS.map((opt, i) => {
                          const isLast = i === SUBJECT_OPTIONS.length - 1
                          return (
                            <li
                              key={opt}
                              role="option"
                              aria-selected={subject === opt}
                              className={!isLast ? "border-b border-hairline" : ""}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSubject(opt)
                                  setDropdownOpen(false)
                                }}
                                className="pbm-ui group flex h-14 w-full items-center justify-between px-5 text-ink transition-colors hover:bg-ink/5"
                              >
                                {opt}
                                <span
                                  aria-hidden
                                  className="text-[14px] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                >
                                  →
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </FieldShell>

              <FieldShell label="Message" htmlFor="contact-message">
                <Textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us a little about what you need."
                />
              </FieldShell>

              {status === "error" && (
                <p role="alert" className="text-[11px] text-error">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="pbm-bar disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? (
                  "Sending…"
                ) : (
                  <>
                    Send Message <span aria-hidden className="ml-3">→</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
