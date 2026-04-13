import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Plus, Minus, X, ArrowRight } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

/* ────────────────────────────────────────────────────────────
 * Spec A2 — Mobile hamburger menu (open state).
 *
 * Sheet slides in from the right, full viewport height,
 * solid #0a0a0a, off-white text. Playfair links with gold
 * "01 / 02 …" prefixes, hairline dividers, MODELS expandable.
 * Pinned bottom: FOLLOW + city list.
 * ──────────────────────────────────────────────────────────── */

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MENU = [
  { num: "01", to: "/", label: "Home" },
  {
    num: "02",
    to: "/models",
    label: "Models",
    children: [
      { to: "/models/female", label: "— Women" },
      { to: "/models/male", label: "— Men" },
    ],
  },
  { num: "03", to: "/events", label: "Events" },
  { num: "04", to: "/become-a-model", label: "Become a Model" },
  { num: "05", to: "/about", label: "About" },
  { num: "06", to: "/contact", label: "Contact" },
] as const

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const [modelsExpanded, setModelsExpanded] = useState(false)
  const location = useLocation()

  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="!w-full !max-w-none border-0 bg-ink text-paper p-0 gap-0 [&>*]:text-paper"
      >
        <SheetTitle className="sr-only">Primary Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Site links and social media
        </SheetDescription>

        {/* ─── Top bar — same height as collapsed nav ─── */}
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-hairline-inverse">
          <Link to="/" onClick={close} className="font-display italic text-[28px] text-gold leading-none">
            PB.
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center text-paper"
          >
            <X className="size-6" strokeWidth={1.25} />
          </button>
        </div>

        {/* ─── Body ─── */}
        <div className="flex-1 overflow-y-auto px-10 pt-14 pb-10">
          <ul className="flex flex-col">
            {MENU.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to)
              const expandable = "children" in item && item.children
              const expanded = expandable && modelsExpanded

              return (
                <li
                  key={item.num}
                  className="border-b border-hairline-inverse"
                >
                  <div className="flex items-center justify-between py-7">
                    <Link
                      to={item.to}
                      onClick={!expandable ? close : undefined}
                      className="group inline-flex items-baseline gap-5"
                    >
                      <span className="pbm-meta-label text-gold">
                        {item.num}
                      </span>
                      <span
                        className={`pbm-display-s transition-colors duration-300 ${
                          isActive ? "text-gold" : "text-paper group-hover:text-gold"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                    {expandable && (
                      <button
                        type="button"
                        aria-label={
                          expanded ? "Collapse Models" : "Expand Models"
                        }
                        onClick={() => setModelsExpanded((v) => !v)}
                        className="inline-flex h-9 w-9 items-center justify-center text-paper"
                      >
                        {expanded ? (
                          <Minus className="size-5" strokeWidth={1.25} />
                        ) : (
                          <Plus className="size-5" strokeWidth={1.25} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Sub-items */}
                  {expandable && expanded && (
                    <ul className="pb-6 pl-12 flex flex-col gap-3">
                      {item.children!.map((c) => (
                        <li key={c.to + c.label}>
                          <Link
                            to={c.to}
                            onClick={close}
                            className="pbm-ui text-mute hover:text-gold transition-colors duration-300"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* ─── Pinned bottom ─── */}
        <div className="border-t border-hairline-inverse px-10 py-8 flex flex-col gap-5">
          <p className="pbm-meta-label">Follow</p>
          <div className="flex flex-col gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="pbm-ui inline-flex items-center gap-3 text-paper hover:text-gold transition-colors duration-300"
            >
              Instagram <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="pbm-ui inline-flex items-center gap-3 text-paper hover:text-gold transition-colors duration-300"
            >
              LinkedIn <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </a>
          </div>
          <p className="pbm-meta-label mt-4">
            Bengaluru &middot; Mumbai &middot; Delhi
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
