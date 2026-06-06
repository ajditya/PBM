import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { publicUrl, type ModelRow } from "@/lib/supabase"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Spec A1 — Desktop MODELS dropdown.
 *
 * Slides down from the nav bar, full viewport width, dark.
 * 12-column grid:
 *   cols 1–5  → two model preview images
 *   cols 7–9  → three Playfair text links
 *   cols 10–12 → "Featured this month" name list
 *   bottom    → hairline + right-aligned full roster CTA
 *
 * Counts, preview images and the featured list all come from the live
 * roster passed down by the Nav (published models, ordered sort_order → name).
 * ──────────────────────────────────────────────────────────── */

interface ModelsDropdownProps {
  models: ModelRow[]
  onClose?: () => void
}

export function ModelsDropdown({ models, onClose }: ModelsDropdownProps) {
  const women = models.filter((m) => m.gender === "female")
  const men = models.filter((m) => m.gender === "male")

  // Only models explicitly tagged featured (both genders). The column hides
  // itself when nothing is featured.
  const featured = models.filter((m) => m.featured).slice(0, 4)

  const womenPreview = women[0]
  const menPreview = men[0]

  return (
    <motion.div
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -8, opacity: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="absolute inset-x-0 top-full bg-ink text-paper border-t border-hairline-inverse"
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-[1600px] grid grid-cols-12 gap-6 px-6 md:px-10 lg:px-14 py-16">
        {/* ─── Cols 1–5: model previews ─── */}
        <div className="col-span-5 grid grid-cols-2 gap-6">
          <Link to="/models/female" onClick={onClose} className="group block">
            <div className="aspect-[5/7] overflow-hidden bg-paper/5">
              {womenPreview?.cover_image && (
                <img
                  src={publicUrl(womenPreview.cover_image)}
                  alt={womenPreview.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                />
              )}
            </div>
            <p className="pbm-meta-label mt-4 text-gold">
              Women — {women.length} {women.length === 1 ? "Talent" : "Talents"}
            </p>
          </Link>

          <Link to="/models/male" onClick={onClose} className="group block">
            <div className="aspect-[5/7] overflow-hidden bg-paper/5">
              {menPreview?.cover_image && (
                <img
                  src={publicUrl(menPreview.cover_image)}
                  alt={menPreview.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                />
              )}
            </div>
            <p className="pbm-meta-label mt-4 text-gold">
              Men — {men.length} {men.length === 1 ? "Talent" : "Talents"}
            </p>
          </Link>
        </div>

        {/* ─── Cols 7–9: large Playfair text links ─── */}
        <div className="col-span-3 col-start-7 flex flex-col justify-start gap-6">
          {[
            { to: "/models/female", label: "Women" },
            { to: "/models/male", label: "Men" },
          ].map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              onClick={onClose}
              className="group inline-flex items-center gap-3 self-start"
            >
              <span className="pbm-display-s text-paper transition-colors duration-500 group-hover:text-gold">
                {link.label}
              </span>
              <ArrowRight
                className="size-5 text-paper translate-x-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-gold"
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </div>

        {/* ─── Cols 10–12: featured this month (tiles of tagged models) ─── */}
        {featured.length > 0 && (
          <div className="col-span-3 col-start-10 flex flex-col">
            <p className="pbm-meta-label">Featured This Month</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {featured.map((m) => (
                <Link
                  key={m.slug}
                  to={`/models/${m.slug}`}
                  onClick={onClose}
                  className="group block"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-paper/5">
                    {m.cover_image && (
                      <img
                        src={publicUrl(m.cover_image)}
                        alt={m.name}
                        className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                  <p className="pbm-meta-label mt-3 text-paper transition-colors duration-300 group-hover:text-gold">
                    {m.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ─── Bottom: full roster CTA ─── */}
        <div className="col-span-12 mt-10 flex items-center justify-end border-t border-hairline-inverse pt-6">
          <Link
            to="/models"
            onClick={onClose}
            className="pbm-ui group inline-flex items-center gap-3 text-paper hover:text-gold transition-colors duration-500"
          >
            View the Full Roster
            <ArrowRight
              className="size-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
