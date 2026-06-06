import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Search } from "lucide-react"

import { useScrolled } from "@/hooks/useScrolled"
import { useAsyncData } from "@/hooks/useAsyncData"
import { getModels } from "@/lib/supabase"
import { easeOutExpo } from "@/lib/motion"
import { brandLogos } from "@/lib/placeholder-assets"
import { ModelsDropdown } from "@/components/layout/ModelsDropdown"
import { MobileMenu } from "@/components/layout/MobileMenu"
import SearchOverlay from "@/components/SearchOverlay"

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

/* Per-brand crop windows for the supplied 3200×3200 PNGs.
 * Values come from sampling the actual content bounding box of each PNG.
 * `pad` adds breathing room around the bbox before fitting it into the chip. */
const LOGO_CROPS = {
  associates: { x: 270, y: 1190, w: 2650, h: 870, pad: 80 },
  models: { x: 670, y: 940, w: 1910, h: 1310, pad: 80 },
} as const

function BrandLogo({
  src,
  alt,
  crop,
  height,
}: {
  src: string
  alt: string
  crop: keyof typeof LOGO_CROPS
  height: number
}) {
  const c = LOGO_CROPS[crop]
  const cropX = c.x - c.pad
  const cropY = c.y - c.pad
  const cropW = c.w + c.pad * 2
  const cropH = c.h + c.pad * 2
  const aspect = cropW / cropH
  const chipW = height * aspect
  const scale = chipW / cropW
  const scaledSize = 3200 * scale
  const offsetX = -cropX * scale
  const offsetY = -cropY * scale

  return (
    <span
      className="relative block overflow-hidden"
      style={{ width: chipW, height }}
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          position: "absolute",
          width: scaledSize,
          height: scaledSize,
          maxWidth: "none",
          left: offsetX,
          top: offsetY,
          filter: "brightness(0) invert(1)",
        }}
        className="select-none"
      />
    </span>
  )
}

/**
 * Nav entry that owns the Models dropdown. Clicking it opens the menu (rather
 * than navigating straight to a roster) and lets the user pick where to go;
 * hovering opens it too. Mirrors NavItem's underline / active styling.
 */
function NavDropdownTrigger({
  label,
  active,
  open,
  onToggle,
  onMouseEnter,
}: {
  label: string
  active: boolean
  open: boolean
  onToggle: () => void
  onMouseEnter?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      aria-haspopup="menu"
      aria-expanded={open}
      className={[
        "pbm-ui group relative inline-flex h-8 items-center transition-colors duration-500",
        active ? "text-gold" : "text-paper hover:text-paper",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      />
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-gold"
        />
      )}
    </button>
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
          "pbm-ui group relative inline-flex h-8 items-center transition-colors duration-500",
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
  const [searchOpen, setSearchOpen] = useState(false)

  // Live roster powers the dropdown's counts, previews and featured list.
  const { data: modelsData } = useAsyncData(() => getModels(), [])
  const models = modelsData ?? []

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
          height: solid ? 112 : 144,
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
            <NavLink to="/" className="shrink-0" aria-label="Prasad Bidapa Associates — Home">
              <BrandLogo
                src={brandLogos.associates}
                alt="Prasad Bidapa Associates"
                crop="associates"
                height={56}
              />
            </NavLink>

            {/* ─── Center link rail (desktop) ─── */}
            <nav
              aria-label="Primary"
              className="hidden lg:flex items-center gap-9 xl:gap-11"
            >
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <NavDropdownTrigger
                    key={link.to + link.label}
                    label={link.label}
                    active={location.pathname.startsWith("/models")}
                    open={dropdownOpen}
                    // Open on click (and on hover) instead of navigating; the
                    // panel closes on mouse-leave or when a link is chosen.
                    onToggle={() => setDropdownOpen(true)}
                    onMouseEnter={() => setDropdownOpen(true)}
                  />
                ) : (
                  <NavItem
                    key={link.to + link.label}
                    to={link.to}
                    label={link.label}
                    end={link.end}
                    onMouseEnter={() => setDropdownOpen(false)}
                  />
                ),
              )}
            </nav>

            {/* ─── Right cluster — search icon + wordmark (desktop) ─── */}
            <div className="hidden lg:flex shrink-0 items-center gap-6">
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center text-paper transition-colors hover:text-gold"
              >
                <Search className="size-4" strokeWidth={1.5} />
              </button>
              <NavLink to="/models" aria-label="Prasad Bidapa Models">
                <BrandLogo
                  src={brandLogos.models}
                  alt="Prasad Bidapa Models"
                  crop="models"
                  height={64}
                />
              </NavLink>
            </div>

            {/* ─── Mobile cluster — search + hamburger ─── */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center text-paper"
              >
                <Search className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center text-paper"
              >
                <Menu className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* ─── Models dropdown panel (desktop) ─── */}
          <AnimatePresence>
            {dropdownOpen && (
              <ModelsDropdown models={models} onClose={closeDropdown} />
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* ─── Mobile menu sheet ─── */}
      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />

      {/* ─── Search overlay (full-screen) ─── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
