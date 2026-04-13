import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import {
  events,
  femaleModels,
  maleModels,
  properties,
} from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * H5 — Search Overlay.
 *
 * Slides down from top, off-white. × top-right, "PB." monogram
 * top-left. Single-line input with a 2px ink bottom hairline,
 * Playfair 56px text, tracked grey placeholder. Below: QUICK
 * LINKS row + a results preview that filters across models,
 * events and properties.
 *
 * Local-only — no network. Closes on Esc.
 * ──────────────────────────────────────────────────────────── */

interface Props {
  open: boolean
  onClose: () => void
}

interface Result {
  type: "Model" | "Event" | "Property"
  label: string
  to: string
}

const QUICK_LINKS: Array<{ label: string; to: string }> = [
  { label: "Women", to: "/models/female" },
  { label: "Men", to: "/models/male" },
  { label: "Mega Model Hunt", to: "/events/mega-model-hunt-2026" },
  { label: "Become a Model", to: "/become-a-model" },
  { label: "About", to: "/about" },
]

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on open. Query clears in cleanup so the next open
  // starts fresh — keeps setState out of the synchronous effect body.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 200)
    return () => {
      clearTimeout(t)
      setQuery("")
    }
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const out: Result[] = []
    for (const m of femaleModels) {
      if (m.name.toLowerCase().includes(q))
        out.push({ type: "Model", label: `${m.name} · Women`, to: `/models/${m.slug}` })
    }
    for (const m of maleModels) {
      if (m.name.toLowerCase().includes(q))
        out.push({ type: "Model", label: `${m.name} · Men`, to: `/models/${m.slug}` })
    }
    for (const e of events) {
      if (e.title.toLowerCase().includes(q))
        out.push({ type: "Event", label: e.title, to: `/events/${e.slug}` })
    }
    for (const p of properties) {
      if (p.title.toLowerCase().includes(q))
        out.push({ type: "Property", label: p.title, to: "/about" })
    }
    return out.slice(0, 8)
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="fixed inset-0 z-[150] flex flex-col bg-paper text-ink"
        >
          {/* ── Top bar: monogram + close ── */}
          <div className="flex items-center justify-between border-b border-hairline px-6 py-6 sm:px-10 lg:px-14">
            <span className="pbm-display-s italic">PB.</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-10 w-10 items-center justify-center text-[18px] font-light text-ink hover:text-gold"
            >
              ×
            </button>
          </div>

          {/* ── Body ── */}
          <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 py-16 sm:px-10 sm:py-24 lg:px-14 lg:py-32">
            {/* Input */}
            <label htmlFor="search-input" className="pbm-meta-label mb-6">
              Search
            </label>
            <input
              id="search-input"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH MODELS, EVENTS, OR PRESS..."
              className="pbm-display-m block w-full border-0 border-b-2 border-ink bg-transparent pb-4 text-ink outline-none placeholder:text-[14px] placeholder:tracking-[0.32em] placeholder:text-mute placeholder:font-sans focus:outline-none sm:placeholder:text-[16px]"
            />

            {/* Results or quick links */}
            <div className="mt-16">
              {results.length > 0 ? (
                <div>
                  <p className="pbm-eyebrow mb-6">
                    Results · {results.length}
                  </p>
                  <ul className="divide-y divide-hairline">
                    {results.map((r) => (
                      <li key={r.to + r.label}>
                        <Link
                          to={r.to}
                          onClick={onClose}
                          className="group flex items-center justify-between py-5 transition-colors hover:text-gold"
                        >
                          <span className="pbm-display-xs text-ink">
                            {r.label}
                          </span>
                          <span className="flex items-center gap-6">
                            <span className="pbm-meta-label">{r.type}</span>
                            <span aria-hidden className="text-gold">→</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="pbm-meta-label mb-6">Quick Links</p>
                  <div className="flex flex-wrap gap-x-10 gap-y-4">
                    {QUICK_LINKS.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={onClose}
                        className="pbm-link text-ink"
                      >
                        {l.label} <span aria-hidden>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
