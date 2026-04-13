import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

/* ────────────────────────────────────────────────────────────
 * Persistent footer.
 *
 * Desktop (Screen 1 spec): two-col `#0a0a0a` background, Playfair
 * logo + Bengaluru studio address left, nav columns + socials +
 * newsletter right, hairline copyright row.
 *
 * Mobile (F2 spec): stacked vertical, hairline-separated stack of
 * logo / address / newsletter / nav / socials / copyright.
 * ──────────────────────────────────────────────────────────── */

const HOUSE_LINKS = [
  { to: "/models", label: "Models" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const

const WORK_LINKS = [
  { to: "/events/mega-model-hunt-2026", label: "Mega Model Hunt" },
  { to: "/become-a-model", label: "Become a Model" },
  { to: "/about", label: "Press" },
  { to: "/about", label: "Privacy" },
] as const

function Wordmark() {
  return (
    <Link to="/" className="pbm-display-m inline-flex flex-col text-paper">
      <span>Prasad</span>
      <span>Bidapa.</span>
    </Link>
  )
}

function StudioAddress() {
  return (
    <div className="flex flex-col gap-3">
      <p className="pbm-eyebrow">Studio</p>
      <p className="pbm-body-inverse">
        23, 1st Cross Road
        <br />
        Yelahanka New Town
        <br />
        Bengaluru 560064 · India
      </p>
    </div>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState("")
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4"
    >
      <p className="pbm-meta-label">Stay In Touch</p>
      <div className="flex items-end gap-3 border-b border-hairline-inverse focus-within:border-gold transition-colors duration-500">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="pbm-meta-value flex-1 bg-transparent border-0 outline-none py-3 text-paper placeholder:text-paper/40"
          aria-label="Email address"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="inline-flex h-9 w-9 items-center justify-center text-paper transition-colors duration-300 hover:text-gold"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </form>
  )
}

function NavColumn({
  label,
  links,
}: {
  label: string
  links: readonly { to: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="pbm-meta-label">{label}</p>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link
              to={l.to}
              className="pbm-ui text-paper hover:text-gold transition-colors duration-300"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLinks() {
  return (
    <div className="flex flex-col gap-4">
      <p className="pbm-meta-label">Follow</p>
      <div className="flex flex-col gap-3">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="pbm-ui group inline-flex items-center gap-3 text-paper hover:text-gold transition-colors duration-300"
        >
          Instagram
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="pbm-ui group inline-flex items-center gap-3 text-paper hover:text-gold transition-colors duration-300"
        >
          LinkedIn
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </a>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      {/* ─── Desktop ─────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-14 py-24">
          <div className="grid grid-cols-12 gap-12">
            {/* Left col — wordmark + address */}
            <div className="col-span-5 flex flex-col gap-12">
              <Wordmark />
              <div className="border-t border-hairline-inverse pt-10">
                <StudioAddress />
              </div>
            </div>

            {/* Right col — nav, socials, newsletter */}
            <div className="col-span-7 grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <NavColumn label="The House" links={HOUSE_LINKS} />
              </div>
              <div className="col-span-3">
                <NavColumn label="The Work" links={WORK_LINKS} />
              </div>
              <div className="col-span-3">
                <SocialLinks />
              </div>
              <div className="col-span-12 mt-12 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>

          {/* Bottom hairline row */}
          <div className="mt-20 pt-8 border-t border-hairline-inverse flex items-center justify-between">
            <p className="pbm-meta-label">
              &copy; 2026 Prasad Bidapa. All rights reserved.
            </p>
            <p className="pbm-meta-label">
              Crafted in Bengaluru
            </p>
          </div>
        </div>
      </div>

      {/* ─── Mobile (F2) ─────────────────────────────────── */}
      <div className="block lg:hidden px-8 pt-20 pb-10">
        <Wordmark />

        <div className="mt-12 border-t border-hairline-inverse pt-10">
          <StudioAddress />
        </div>

        <div className="mt-10 border-t border-hairline-inverse pt-10">
          <NewsletterForm />
        </div>

        <div className="mt-10 border-t border-hairline-inverse pt-10">
          <ul className="flex flex-col gap-5">
            {[...HOUSE_LINKS, ...WORK_LINKS].map((l) => (
              <li key={l.to + l.label}>
                <Link
                  to={l.to}
                  className="pbm-ui text-paper hover:text-gold transition-colors duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-hairline-inverse pt-10">
          <SocialLinks />
        </div>

        <div className="mt-12 pt-6 border-t border-hairline-inverse flex items-center justify-between">
          <p className="pbm-meta-label">
            &copy; 2026
          </p>
          <p className="pbm-meta-label">
            Bengaluru
          </p>
        </div>
      </div>
    </footer>
  )
}
