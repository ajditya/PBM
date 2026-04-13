import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * H3 — Cookie Consent Banner.
 *
 * Pinned bottom, full width, 80px tall, dark `#0a0a0a` bg with
 * a 1px gold hairline top border. Inter 13px copy left, two text
 * links (DECLINE · ACCEPT) right divided by a thin vertical
 * hairline. Acceptance persists in localStorage.
 * ──────────────────────────────────────────────────────────── */

const STORAGE_KEY = "pbm-cookie-consent"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show only if no decision has been recorded yet. Always defer the
    // visibility flip behind a timeout so we never call setState
    // synchronously inside the effect body.
    let needsConsent = true
    try {
      needsConsent = !window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable — show anyway
      needsConsent = true
    }
    if (!needsConsent) return
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const decide = (choice: "accept" | "decline") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // ignore
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Cookie consent"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="fixed inset-x-0 bottom-0 z-[120] border-t border-gold bg-ink text-paper"
        >
          <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10 sm:py-0 sm:[height:80px] lg:px-14">
            <p className="pbm-body-inverse">
              We use cookies to enhance your experience. Read our{" "}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-gold underline decoration-gold underline-offset-4 transition-colors hover:text-paper"
              >
                Privacy Policy
              </a>
              .
            </p>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => decide("decline")}
                className="pbm-ui text-paper/60 transition-colors hover:text-paper"
              >
                Decline
              </button>
              <span aria-hidden className="h-4 w-px bg-paper/30" />
              <button
                type="button"
                onClick={() => decide("accept")}
                className="pbm-ui text-paper transition-colors hover:text-gold"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
