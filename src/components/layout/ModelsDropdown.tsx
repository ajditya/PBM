import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { femaleModels, maleModels } from "@/lib/placeholder-assets"
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
 * ──────────────────────────────────────────────────────────── */

const FEATURED = [femaleModels[0], maleModels[0], femaleModels[3]]

interface ModelsDropdownProps {
  onClose?: () => void
}

export function ModelsDropdown({ onClose }: ModelsDropdownProps) {
  const womenPreview = femaleModels[0]
  const menPreview = maleModels[0]

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
          <Link
            to="/models/female"
            onClick={onClose}
            className="group block"
          >
            <div className="aspect-[5/7] overflow-hidden bg-paper/5">
              <img
                src={womenPreview.img}
                alt={womenPreview.name}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
              />
            </div>
            <p className="pbm-meta-label mt-4 text-gold">
              Women — {femaleModels.length} Talents
            </p>
          </Link>

          <Link to="/models/male" onClick={onClose} className="group block">
            <div className="aspect-[5/7] overflow-hidden bg-paper/5">
              <img
                src={menPreview.img}
                alt={menPreview.name}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
              />
            </div>
            <p className="pbm-meta-label mt-4 text-gold">
              Men — {maleModels.length} Talents
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

        {/* ─── Cols 10–12: featured this month ─── */}
        <div className="col-span-3 col-start-10 flex flex-col">
          <p className="pbm-meta-label">Featured This Month</p>
          <ul className="mt-6 space-y-4">
            {FEATURED.map((m) => (
              <li key={m.slug}>
                <Link
                  to={`/models/${m.slug}`}
                  onClick={onClose}
                  className="pbm-meta-value group inline-flex items-center justify-between gap-4 w-full text-paper transition-colors duration-300 hover:text-gold"
                >
                  <span>{m.name}</span>
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

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
