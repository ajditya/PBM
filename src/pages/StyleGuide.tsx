import { motion } from "framer-motion"
import { ArrowRight, X, Plus, Minus, Menu, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { brandLogos } from "@/lib/placeholder-assets"
import { fadeUp, stagger } from "@/lib/motion"

function InstagramGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="0" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function LinkedinGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 9h3v11H4zM5.5 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
      <path d="M10 9h3v1.6c.7-1.1 1.9-1.9 3.5-1.9 2.5 0 4.5 1.6 4.5 4.6V20h-3v-6.1c0-1.5-.7-2.5-2.1-2.5s-2.4 1-2.4 2.5V20h-3z" />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────
 * Phase 1 — Visual System Reference Sheet (Screen J)
 *
 * One long editorial page that doubles as proof the design
 * tokens, type scale, and primitives all render to spec.
 * ──────────────────────────────────────────────────────────── */

const PALETTE = [
  { name: "Primary Black", hex: "#0a0a0a", swatch: "bg-ink", label: "text-mute" },
  { name: "Off-White", hex: "#fafaf7", swatch: "bg-paper border border-hairline", label: "text-mute" },
  { name: "Accent Gold", hex: "#c9a961", swatch: "bg-gold", label: "text-mute" },
  { name: "Muted Grey", hex: "#8a8a85", swatch: "bg-mute", label: "text-mute" },
] as const

const DISPLAY_SIZES = [
  { px: 160, label: "Display XL · 160px desktop", className: "text-[56px] md:text-[120px] lg:text-[160px] leading-[0.9]" },
  { px: 96, label: "Display L · 96px desktop", className: "text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95]" },
  { px: 72, label: "Display M · 72px desktop", className: "text-[40px] md:text-[60px] lg:text-[72px] leading-[1]" },
  { px: 48, label: "Display S · 48px desktop", className: "text-[32px] md:text-[40px] lg:text-[48px] leading-[1.05]" },
  { px: 32, label: "Heading · 32px", className: "text-[24px] md:text-[28px] lg:text-[32px] leading-[1.1]" },
  { px: 24, label: "Subheading · 24px", className: "text-[20px] md:text-[22px] lg:text-[24px] leading-[1.2]" },
] as const

const BODY_SIZES = [
  { label: "Body L · 18px", className: "text-[18px]", text: "An editorial agency that has shaped Indian fashion for four decades." },
  { label: "Body M · 16px", className: "text-[16px]", text: "An editorial agency that has shaped Indian fashion for four decades." },
  { label: "Body S · 14px", className: "text-[14px]", text: "An editorial agency that has shaped Indian fashion for four decades." },
  { label: "Caption · 13px", className: "text-[13px]", text: "Curated by Prasad Bidapa Models & Associates, established 1985." },
  { label: "Micro · 12px", className: "text-[12px]", text: "Curated by Prasad Bidapa Models & Associates, established 1985." },
] as const

const SPACING_STEPS = [4, 8, 16, 24, 32, 48, 64, 96, 128, 160] as const

const ICONS = [
  { Icon: ArrowRight, name: "ArrowRight" },
  { Icon: X, name: "Close" },
  { Icon: Plus, name: "Plus" },
  { Icon: Minus, name: "Minus" },
  { Icon: InstagramGlyph, name: "Instagram" },
  { Icon: LinkedinGlyph, name: "LinkedIn" },
  { Icon: Menu, name: "Menu" },
  { Icon: Search, name: "Search" },
] as const

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-mute">
      <span className="text-gold">{index}</span>
      <span aria-hidden className="h-px w-8 bg-hairline" />
      <span>{children}</span>
    </div>
  )
}

function Section({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-hairline pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionLabel index={index}>{title}</SectionLabel>
      <div className="mt-12 md:mt-16">{children}</div>
    </section>
  )
}

export default function StyleGuide() {
  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 py-24 md:py-32">
        {/* ─── Header ─────────────────────────────────────── */}
        <motion.header
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="pb-16 md:pb-24"
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] uppercase tracking-[0.2em] text-gold"
          >
            v1.0 · Brand Guidelines &amp; Digital Standards
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-display font-light mt-6 text-[56px] leading-[0.95] md:text-[96px] lg:text-[120px] tracking-[-0.02em]"
          >
            Prasad Bidapa<span className="text-mute"> —</span>
            <br />
            Visual System.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-[14px] leading-relaxed text-mute"
          >
            The complete typographic, chromatic, and structural language for
            Prasad Bidapa Models &amp; Associates. Every screen across the
            digital estate refers back to this sheet.
          </motion.p>
        </motion.header>

        {/* ─── 01 — Color Palette ─────────────────────────── */}
        <Section index="01" title="Color Palette">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {PALETTE.map((c) => (
              <div key={c.hex} className="flex flex-col">
                <div
                  className={`aspect-square w-full ${c.swatch}`}
                  aria-label={c.name}
                />
                <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-mute">
                  {c.name}
                </p>
                <p className="mt-2 font-display text-[20px] leading-none">
                  {c.hex}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 02 — Typographic Scale ─────────────────────── */}
        <Section index="02" title="Typographic Scale">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Display column */}
            <div className="lg:col-span-8 space-y-12">
              {DISPLAY_SIZES.map((s) => (
                <div key={s.px} className="flex flex-col gap-3">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-mute">
                    {s.label}
                  </span>
                  <span
                    className={`font-display font-light tracking-[-0.02em] ${s.className}`}
                  >
                    Faces.
                  </span>
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Italic Serif · Editorial accent
                </span>
                <span className="font-display italic font-light text-[36px] leading-[1.1] text-gold">
                  &ldquo;India&rsquo;s master artisans are our national
                  treasures.&rdquo;
                </span>
              </div>
            </div>

            {/* Body column */}
            <div className="lg:col-span-4 space-y-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                Inter · Body / UI
              </p>
              {BODY_SIZES.map((s) => (
                <div key={s.label} className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-mute">
                    {s.label}
                  </span>
                  <p className={`${s.className} text-ink`}>{s.text}</p>
                </div>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Tracked Caps · 11px / 0.2em
                </span>
                <p className="text-[11px] uppercase tracking-[0.2em]">
                  Prasad Bidapa Models &amp; Associates
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── 03 — Logo Lockups ──────────────────────────── */}
        <Section index="03" title="Logo Lockups">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 items-end">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex h-[180px] w-full items-center justify-center px-4">
                <img
                  src={brandLogos.associates}
                  alt="Prasad Bidapa Associates"
                  className="max-h-[180px] w-auto object-contain"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink">
                  Prasad Bidapa Associates
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
                  Events Arm · Full lockup
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex h-[180px] w-full items-center justify-center px-4">
                <img
                  src={brandLogos.models}
                  alt="Prasad Bidapa Models"
                  className="max-h-[180px] w-auto object-contain"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink">
                  Prasad Bidapa Models
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
                  Agency Arm · Full lockup
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex h-[180px] w-full items-center justify-center px-4">
                <span className="font-display italic font-light text-[112px] leading-none">
                  PB.
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink">
                  PB. Monogram
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
                  Compact mark · Editorial use
                </p>
              </div>
            </div>
          </div>
          <p className="mt-12 text-[13px] leading-relaxed text-mute max-w-xl">
            The two house lockups are reproduced as supplied — the typographic
            DNA of each mark is fixed and not to be redrawn. The PB. monogram
            in italic Playfair is the editorial compact form used in narrow
            spaces, page transitions, and the mobile menu header.
          </p>
        </Section>

        {/* ─── 04 — Interactive Library ───────────────────── */}
        <Section index="04" title="Interactive Library">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Buttons */}
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Primary CTA · Solid Bar
                </p>
                <button type="button" className="pbm-bar max-w-[280px]">
                  Become a Model
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Secondary · Outlined
                </p>
                <button
                  type="button"
                  className="inline-flex w-full max-w-[280px] items-center justify-center border border-ink px-6 py-5 text-[13px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-paper"
                >
                  View Portfolio
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Disabled
                </p>
                <button
                  type="button"
                  disabled
                  className="pbm-bar max-w-[280px] cursor-not-allowed opacity-30"
                >
                  Submit Application
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Editorial Link · Hover for underline
                </p>
                <a href="#" className="pbm-link inline-flex">
                  Explore the Roster <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Editorial Link · Underlined Default
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-mute underline underline-offset-4 decoration-mute hover:text-ink hover:decoration-ink"
                >
                  Watch the Showreel <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                  Inline Interaction (Gold)
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold"
                >
                  Scroll to Discover
                  <span aria-hidden className="block h-px w-10 bg-gold" />
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── 05 — Input Architecture ────────────────────── */}
        <Section index="05" title="Input Architecture">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-4xl">
            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.2em] text-mute">
                Model Name
              </label>
              <Input placeholder="Full Name" />
              <p className="text-[11px] tracking-[0.05em] text-mute">
                Default state
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.2em] text-gold">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="contact@prasadbidapa.com"
                className="block w-full bg-transparent border-0 border-b-2 border-gold px-0 py-3 text-[16px] text-ink outline-none pb-[10px]"
              />
              <p className="text-[11px] tracking-[0.05em] text-gold">
                Focused / Active state
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.2em] text-error">
                Contact Number
              </label>
              <input
                type="tel"
                defaultValue="+91 0000 0000"
                aria-invalid
                className="block w-full bg-transparent border-0 border-b border-error px-0 py-3 text-[16px] text-ink outline-none"
              />
              <p className="text-[11px] tracking-[0.05em] text-error">
                Validation Error State
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.2em] text-mute">
                Application Subject
              </label>
              <input
                type="text"
                defaultValue="Editorial Inquiry"
                className="block w-full bg-transparent border-0 border-b border-ink px-0 py-3 text-[16px] text-ink outline-none"
              />
              <p className="text-[11px] tracking-[0.05em] text-mute">
                Filled state
              </p>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.2em] text-mute opacity-50">
                Disabled Field
              </label>
              <Input disabled placeholder="This field is locked" />
              <p className="text-[11px] tracking-[0.05em] text-mute">
                Disabled state
              </p>
            </div>
          </div>
        </Section>

        {/* ─── 06 — Structural Rhythm ─────────────────────── */}
        <Section index="06" title="Structural Rhythm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Spacing scale */}
            <div className="lg:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-mute mb-8">
                Spacing Increments
              </p>
              <div className="space-y-5">
                {SPACING_STEPS.map((step) => (
                  <div key={step} className="flex items-center gap-6">
                    <div
                      className="bg-gold"
                      style={{ width: `${step}px`, height: `${Math.max(12, step / 6)}px` }}
                      aria-label={`${step} pixels`}
                    />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-mute">
                      {step}px
                      {step === 4 && " · Hairline gap"}
                      {step === 16 && " · Content padding"}
                      {step === 64 && " · Page margin"}
                      {step === 160 && " · Section break"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 12-col grid overlay */}
            <div className="lg:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.2em] text-mute mb-8">
                The Asymmetric Field · 12-col
              </p>
              <div className="border border-hairline p-6">
                <div className="grid grid-cols-12 gap-2 h-[320px]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-gold/15" />
                  ))}
                </div>
              </div>
              <p className="mt-6 text-[13px] leading-relaxed text-mute max-w-md">
                Standard layouts use a 12-column grid at 1440px with 24px
                gutters. Luxury editorial moments use a 10-column offset where
                content skips 1/12 for imagery and 4/12 for typography.
              </p>
            </div>
          </div>
        </Section>

        {/* ─── 07 — Iconographic Language ─────────────────── */}
        <Section index="07" title="Iconographic Language">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 md:gap-12 max-w-4xl">
            {ICONS.map(({ Icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-4">
                <Icon className="size-5 text-ink" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-mute">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-12 text-[13px] leading-relaxed text-mute max-w-md">
            Icons drawn from Lucide at 20px, 1.5 stroke. Used sparingly. Never
            decorative — always paired with a label or action.
          </p>
        </Section>

        {/* ─── Sign off ───────────────────────────────────── */}
        <footer className="border-t border-hairline mt-12 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
            End of Reference Sheet
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
            Bengaluru &middot; Mumbai &middot; Delhi
          </p>
        </footer>
      </div>
    </main>
  )
}
