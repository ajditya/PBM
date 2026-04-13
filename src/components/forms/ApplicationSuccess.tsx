import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * D3 — Application Success Screen.
 *
 * Full-viewport off-white. Tiny tracked gold reference number
 * up top, huge Playfair "Thank you, / Aisha." headline, paragraph,
 * RETURN HOME link, and a single thin gold vertical line down the
 * right edge. Calm and final.
 * ──────────────────────────────────────────────────────────── */

interface Props {
  firstName?: string
}

export default function ApplicationSuccess({ firstName }: Props) {
  const greetingName = firstName?.trim() || "you"

  return (
    <div className="relative flex min-h-[80vh] items-center bg-paper text-ink">
      {/* Right-edge gold vertical line */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.6, ease: easeOutExpo, delay: 0.2 }}
        className="absolute right-0 top-0 h-full w-px origin-top bg-gold"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo }}
          className="pbm-eyebrow mb-12"
        >
          Application received · 13 April 2026 · #PB-2026-0247
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.1 }}
          className="pbm-display-l"
        >
          Thank you,
          <br />
          {greetingName}.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.3 }}
          className="pbm-body mt-12 max-w-[52ch] space-y-6"
        >
          <p>
            Your application is with our scouting team. We review every
            submission for the next Mega Model Hunt cycle within fourteen
            days, and respond to everyone — yes or no.
          </p>
          <p>
            If your file moves forward, we will email a city audition slot
            and a brief on what to bring.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.5 }}
          className="mt-16"
        >
          <Link to="/" className="pbm-link text-ink">
            Return home <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
