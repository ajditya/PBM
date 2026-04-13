import { AnimatePresence, motion } from "framer-motion"

import { dismissToast, useToasts, type Toast } from "@/hooks/useToast"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * H6 — Toast Notification.
 *
 * 400 × 80 px, pinned bottom-center. `#0a0a0a` bg, off-white text,
 * 2 px gold left border (red for the error variant). Tracked
 * small-caps label + Inter 14 px body + × dismiss right.
 *
 * Layout-driven viewport. The store is in `hooks/useToast.ts`;
 * call `toast({ label, message })` from anywhere to push.
 * ──────────────────────────────────────────────────────────── */

function ToastCard({ toast }: { toast: Toast }) {
  const isError = toast.variant === "error"
  return (
    <motion.div
      layout
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 12, opacity: 0 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className={`pointer-events-auto flex min-h-[80px] w-[400px] max-w-[calc(100vw-32px)] items-start gap-4 border-l-2 ${
        isError ? "border-error" : "border-gold"
      } bg-ink px-5 py-4 text-paper`}
      role="status"
      aria-live="polite"
    >
      <div className="flex-1">
        {toast.label && (
          <p
            className={`pbm-meta-label ${
              isError ? "text-error" : "text-gold"
            }`}
          >
            {toast.label}
          </p>
        )}
        <p className="pbm-meta-value mt-1 text-paper/90">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
        className="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center text-[16px] font-light text-paper/70 hover:text-paper"
      >
        ×
      </button>
    </motion.div>
  )
}

export function ToastViewport() {
  const toasts = useToasts()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[160] flex flex-col items-center gap-3 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  )
}
