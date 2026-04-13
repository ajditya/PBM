import { Link } from "react-router-dom"

import type { events } from "@/lib/placeholder-assets"

/* ────────────────────────────────────────────────────────────
 * Reusable editorial event card.
 *
 * Default state per Screen 1 fold 6 / Screen 4 grid:
 *   - full-bleed 4:5 image
 *   - Playfair date below
 *   - title + tracked-caps city
 *   - thin "VIEW →" link
 *
 * Hover state (E2):
 *   - image lifts 8px upward with a very faint ground shadow
 *   - date shifts to gold
 *   - VIEW gets a gold underline drawn in left-to-right
 *   - "01 / 04" pagination indicator fades in top-right of image
 *     (only when `index` + `total` are provided)
 * ──────────────────────────────────────────────────────────── */

type EventLike = (typeof events)[number]

export interface EventCardProps {
  event: EventLike
  /** Optional fixed width (e.g. for a horizontal-scroll row). */
  width?: string | number
  /** 1-based position in a set, used for the E2 hover indicator. */
  index?: number
  /** Total cards in the set. Pairs with `index`. */
  total?: number
}

export default function EventCard({
  event,
  width,
  index,
  total,
}: EventCardProps) {
  const showIndicator = index !== undefined && total !== undefined
  const indicator = showIndicator
    ? `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
    : null

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group relative block shrink-0"
      style={width !== undefined ? { width } : undefined}
    >
      {/* ─── Image ─── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
        <img
          src={event.cover}
          alt={event.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2"
        />

        {/* Ground-reference shadow (only allowed shadow per spec) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-1 h-3 opacity-0 blur-md transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-30"
          style={{ background: "radial-gradient(ellipse at center, rgba(10,10,10,0.55), transparent 70%)" }}
        />

        {/* Pagination indicator — top-right, fades in on hover */}
        {indicator && (
          <span className="pbm-meta-label pointer-events-none absolute right-4 top-4 text-paper opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
            {indicator}
          </span>
        )}
      </div>

      {/* ─── Meta ─── */}
      <div className="mt-6 space-y-3">
        <p className="pbm-display-xs text-ink transition-colors duration-500 group-hover:text-gold">
          {event.date}
        </p>
        <h3 className="pbm-display-xs text-ink">{event.title}</h3>
        <p className="pbm-meta-label">{event.city}</p>
        <span className="pbm-ui relative inline-flex items-center gap-2 text-ink">
          View <span aria-hidden>→</span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
          />
        </span>
      </div>
    </Link>
  )
}
