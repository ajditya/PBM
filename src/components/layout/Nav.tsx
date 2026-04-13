import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"

import { useScrolled } from "@/hooks/useScrolled"
import { easeOutExpo } from "@/lib/motion"
import { ModelsDropdown } from "@/components/layout/ModelsDropdown"
import { MobileMenu } from "@/components/layout/MobileMenu"

/* ────────────────────────────────────────────────────────────
 * Persistent top navigation.
 *
 * Three-zone editorial layout:
 *   left wordmark · center link rail · right wordmark
 *
 * State:
 *   - over hero  → transparent background, off-white text, 120px tall
 *   - scrolled   → solid #0a0a0a, off-white text, 80px tall, hairline border
 *
 * Mobile: wordmark left, hamburger right (Sheet from MobileMenu).
 * ──────────────────────────────────────────────────────────── */

interface NavLinkSpec {
  to: string
  label: string
  end?: boolean
  hasDropdown?: boolean
}

const NAV_LINKS: readonly NavLinkSpec[] = [
  { to: "/", label: "Home", end: true },
  { to: "/models", label: "Models", hasDropdown: true },
  { to: "/events", label: "Events" },
  { to: "/become-a-model", label: "Become a Model" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

function StackedWordmark({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="flex flex-col items-start leading-[1.05] select-none">
      <span className="font-display text-[13px] tracking-[0.18em] uppercase">
        {line1}
      </span>
      <span className="text-[9px] tracking-[0.32em] uppercase text-mute mt-1">
        {line2}
      </span>
    </div>
  )
}

function NavItem({
  to,
  label,
  end,
  onMouseEnter,
}: {
  to: string
  label: string
  end?: boolean
  onMouseEnter?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onMouseEnter={onMouseEnter}
      className={({ isActive }) =>
        [
          "group relative inline-flex h-8 items-center text-[11px] uppercase tracking-[0.2em] transition-colors duration-500",
          isActive ? "text-gold" : "text-paper hover:text-paper",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span>{label}</span>
          {/* Hover underline (always available) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          />
          {/* Active state — persistent gold line */}
          {isActive && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-gold"
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Nav() {
  const scrolledPast = useScrolled(80)
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // The nav is only allowed to be transparent over the homepage hero.
  // Every other route renders the solid dark state from scroll position 0.
  const isHome = location.pathname === "/"
  const solid = !isHome || scrolledPast

  // Close dropdown on route change
  const closeDropdown = () => setDropdownOpen(false)

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          height: solid ? 72 : 112,
          backgroundColor: solid ? "rgba(10,10,10,1)" : "rgba(10,10,10,0)",
        }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="fixed inset-x-0 top-0 z-50 will-change-[height,background-color]"
        onMouseLeave={closeDropdown}
      >
        <div
          className={`relative h-full transition-colors duration-500 ${
            solid ? "border-b border-hairline-inverse" : "border-b border-transparent"
          }`}
        >
          <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-8 px-6 md:px-10 lg:px-14 text-paper">
            {/* ─── Left wordmark ─── */}
            <NavLink to="/" className="shrink-0">
              <StackedWordmark line1="Prasad Bidapa" line2="Associates" />
            </NavLink>

            {/* ─── Center link rail (desktop) ─── */}
            <nav
              aria-label="Primary"
              className="hidden lg:flex items-center gap-9 xl:gap-11"
            >
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.to + link.label}
                  to={link.to}
                  label={link.label}
                  end={link.end}
                  onMouseEnter={
                    link.hasDropdown
                      ? () => setDropdownOpen(true)
                      : () => setDropdownOpen(false)
                  }
                />
              ))}
            </nav>

            {/* ─── Right wordmark (desktop) ─── */}
            <NavLink to="/models" className="hidden lg:block shrink-0">
              <StackedWordmark line1="Prasad Bidapa" line2="Models" />
            </NavLink>

            {/* ─── Mobile hamburger ─── */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center text-paper"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* ─── Models dropdown panel (desktop) ─── */}
          <AnimatePresence>
            {dropdownOpen && location.pathname !== "/models" && (
              <ModelsDropdown onClose={closeDropdown} />
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* ─── Mobile menu sheet ─── */}
      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  )
}
