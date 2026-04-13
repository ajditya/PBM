/* ────────────────────────────────────────────────────────────
 * Pagination — minimal "01 / 04" centered control with thin arrows.
 * Used on the Models Listing footer and other paginated screens.
 * ──────────────────────────────────────────────────────────── */

interface Props {
  current: number
  total: number
  onPrev?: () => void
  onNext?: () => void
}

const fmt = (n: number) => n.toString().padStart(2, "0")

export default function Pagination({ current, total, onPrev, onNext }: Props) {
  const atStart = current <= 1
  const atEnd = current >= total

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-10 py-20 sm:gap-14 lg:py-24"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={atStart}
        className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-mute transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink disabled:cursor-not-allowed disabled:text-mute/30 disabled:hover:text-mute/30"
      >
        <span
          aria-hidden
          className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1"
        >
          ←
        </span>
        Previous
      </button>

      <span className="font-display text-[28px] font-light leading-none tracking-[-0.01em] text-ink sm:text-[32px] lg:text-[36px]">
        {fmt(current)} <span className="px-1 text-mute">/</span> {fmt(total)}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-mute transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink disabled:cursor-not-allowed disabled:text-mute/30 disabled:hover:text-mute/30"
      >
        Next
        <span
          aria-hidden
          className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </nav>
  )
}
