import { Link } from "react-router-dom"

/* ────────────────────────────────────────────────────────────
 * ModelCard — masonry tile for the Models Listing roster.
 *
 * Default: full-bleed editorial portrait, name + "VIEW" caption.
 * Hover (B1): image desaturates + faint dark overlay, "VIEW PORTFOLIO"
 * fades in centered with a thin gold underline draw, the name gets
 * its own gold underline, and the arrow shifts 4px right.
 * ──────────────────────────────────────────────────────────── */

interface Props {
  slug: string
  name: string
  img: string
  /** Tailwind aspect-ratio class — controls tile shape inside the masonry. */
  aspect?: string
}

export default function ModelCard({
  slug,
  name,
  img,
  aspect = "aspect-[3/4]",
}: Props) {
  return (
    <Link
      to={`/models/${slug}`}
      className="group mb-2 block break-inside-avoid focus:outline-none"
    >
      <figure className={`relative w-full overflow-hidden bg-ink/5 ${aspect}`}>
        <img
          src={img}
          alt={name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale group-focus-visible:grayscale"
        />
        {/* Faint dark overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-ink/15 group-focus-visible:bg-ink/15" />

        {/* VIEW PORTFOLIO overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="relative inline-block px-1 text-[11px] uppercase tracking-[0.32em] text-paper">
            View Portfolio
            <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
          </span>
        </div>
      </figure>

      <div className="mt-4 pb-2">
        <h3 className="relative inline-block font-display text-[22px] font-light leading-none tracking-[-0.01em] text-ink sm:text-[24px]">
          {name}
          <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-mute transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-ink">
          View
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
