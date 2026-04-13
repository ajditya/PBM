import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { runwayShots } from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * H4 — 404 page.
 *
 * Asymmetric: full-bleed empty runway image on the left half,
 * centered right half with eyebrow + 120px Playfair "Page not /
 * found.", a one-line note and a RETURN HOME link. Bottom-right
 * carries a 90°-rotated wordmark.
 * ──────────────────────────────────────────────────────────── */

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* ── Left — full-bleed runway image ── */}
        <motion.figure
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: easeOutExpo }}
          className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5 lg:aspect-auto lg:h-screen"
        >
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.0, ease: easeOutExpo }}
            src={runwayShots[0]}
            alt="Empty runway"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-ink/15" />
        </motion.figure>

        {/* ── Right — content ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12, delayChildren: 0.2 },
            },
          }}
          className="flex flex-col justify-center px-6 py-24 sm:px-12 sm:py-32 lg:px-16 lg:py-40"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
            }}
            className="pbm-eyebrow mb-10"
          >
            Error · 404
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easeOutExpo } },
            }}
            className="pbm-display-l"
          >
            Page not
            <br />
            found.
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: easeOutExpo } },
            }}
            className="pbm-body mt-10 max-w-[40ch]"
          >
            The page you're looking for has moved off the runway.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.8, ease: easeOutExpo } },
            }}
            className="mt-14"
          >
            <Link to="/" className="pbm-link text-ink">
              <span aria-hidden>←</span> Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Rotated wordmark bottom-right ── */}
      <div
        aria-hidden
        className="pbm-meta-label pointer-events-none absolute bottom-10 right-6 hidden origin-bottom-right -rotate-90 lg:block"
      >
        Prasad Bidapa
      </div>
    </main>
  )
}
