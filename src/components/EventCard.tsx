import { Link } from "react-router-dom"

import type { events } from "@/lib/placeholder-assets"

/* ────────────────────────────────────────────────────────────
 * Reusable editorial event card.
 *
 * Default state per Screen 1 fold 6 / Screen 4 grid:
 *   - full-bleed 3:4 image
 *   - Playfair date below
 *   - title, location row
 *   - thin "VIEW →" link
 *
 * Hover state (E2) per visual system: image lifts 8px, date shifts
 * to gold, "VIEW →" gets a gold underline drawn in. Pure CSS via
 * group-hover so it stays performant in the marquee row.
 * ──────────────────────────────────────────────────────────── */

type EventLike = (typeof events)[number]

export interface EventCardProps {
  event: EventLike
  /** Optional fixed width (e.g. for a horizontal-scroll row). */
  width?: string | number
}

export default function EventCard({ event, width }: EventCardProps) {
  return (
    <Link
      to={`/events/${event.slug}`}
      className="group relative block shrink-0"
      style={width !== undefined ? { width } : undefined}
    >
      {/* ─── Image ─── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink/5">
        <img
          src={event.cover}
          alt={event.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2"
        />
      </div>

      {/* ─── Meta ─── */}
      <div className="mt-6 space-y-3">
        <p className="font-display text-[28px] leading-[1] text-ink transition-colors duration-500 group-hover:text-gold">
          {event.date}
        </p>
        <h3 className="font-display text-[22px] leading-[1.15] text-ink">
          {event.title}
        </h3>
        <p className="text-[11px] tracking-[0.28em] uppercase text-mute">
          {event.city}
        </p>
        <span className="pbm-link text-ink">
          View <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
