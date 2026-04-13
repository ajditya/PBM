import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Spec H1 — Loading / Page Transition.
 *
 * On every route mount the curtain starts fully covering the
 * viewport with the PB. monogram + drawn gold line + LOADING
 * label visible, holds briefly, then sweeps off the top.
 *
 * pointer-events-none so the new page is interactive instantly
 * even while the curtain animates out.
 * ──────────────────────────────────────────────────────────── */

export default function PageTransition() {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 0.9, delay: 0.35, ease: easeOutExpo }}
      className="pointer-events-none fixed inset-0 z-[40] bg-ink will-change-transform"
      aria-hidden
    >
      <div className="flex h-full w-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="flex flex-col items-center gap-6"
        >
          <span className="pbm-display-l italic text-paper">PB.</span>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.6 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="block h-px w-40 bg-gold origin-left"
          />
          <span className="pbm-meta-label">Loading</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
