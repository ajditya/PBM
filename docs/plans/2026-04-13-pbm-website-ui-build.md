# Prasad Bidapa Website — UI Build Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. This is a UI-only build — defer all backend wiring (Supabase, forms, data) until the user explicitly approves Phase 12 (functionality).

---

## ⚡ Status (last updated 2026-04-13)

| Phase | State | Notes |
|---|---|---|
| **0 — Foundation Setup** | ✅ **Complete** | All 6 tasks done. Build clean (51.88 kB CSS / 237.95 kB JS / 597 ms). |
| **1 — Style Guide page** | ✅ **Complete** | Single task. Real brand logos wired into § 03. Build 58.89 kB CSS / 405.88 kB JS / 1.21 s. |
| **2 — Layout (Nav, Footer, transitions)** | ✅ **Complete** | All 5 tasks. Build 63.96 kB CSS / 464.16 kB JS / 847 ms. |
| **3 — Homepage** | ✅ **Complete** | All 6 folds shipped under `src/components/sections/Home*.tsx`. |
| **4 — Models listing** | ✅ **Complete** | `ModelsList.tsx` + `ModelCard.tsx` + `Pagination.tsx` shipped. |
| **5 — Model detail + inquiry dialog** | ✅ **Complete (with open A/B)** | Hero + gallery + InquiryDialog (C1–C4) shipped. **Slider-vs-gallery decision still open** — `ModelDetail.tsx` renders `EditorialSlider` for Men, `EditorialGallery` for Women side-by-side until user picks one. |
| **6 — Events list + detail** | ✅ **Complete** | All 4 tasks. Build 83.28 kB CSS / 515.54 kB JS / 2.42 s. |
| **7 — About** | ⏭ **Next** | |
| 8 — Become a Model | ⬜ Pending | |
| 9 — Contact | ⬜ Pending | |
| 10 — Global components | ⬜ Pending | |
| 11 — Responsive polish | ⬜ Pending | |
| 12 — Functionality (Supabase) | 🚫 Deferred | Do not start without explicit user go-ahead. |

### Phase 0 Progress Log
- ✅ **0.0** Added `Design-Reference/` and `.env.local` to `.gitignore`
- ✅ **0.1** Tailwind v4 `@theme` tokens (ink/paper/gold/mute/error/hairline) + Playfair Display + Inter from Google Fonts + base styles + defensive `* { border-radius: 0 !important }` + `.pbm-link` and `.pbm-bar` utility classes
- ✅ **0.2** `npx shadcn@latest init -t vite -b radix -p nova` — note: shadcn 4.x CLI uses different flags than older versions. Required adding `paths: { "@/*": ["./src/*"] }` to tsconfig (NO `baseUrl` — deprecated in TS 6). `vite.config.ts` got `resolve.alias` for `@`.
- ✅ **0.3** Installed `dialog sheet input textarea navigation-menu carousel card label` plus the `button` from init. **`form` does not exist in the radix-nova registry** — will install `react-hook-form` + `zod` directly in Phase 8.
- ✅ **0.4** Rewrote `src/components/ui/input.tsx` and `textarea.tsx` to be editorial underline-only (no box, no rounded, ink bottom border, gold focus underline, red error underline). Other primitives left as-is — defensive CSS `!important` rule kills any rounded corners they emit. Remapped shadcn's `:root` semantic tokens (`--background`, `--foreground`, `--primary`, `--border`, `--ring`, `--accent`, etc.) from oklch stone defaults to PBM hex palette so any shadcn primitive that uses semantic tokens lands in our colors automatically. Removed shadcn's injected Geist font.
- ✅ **0.5** Created `src/lib/motion.ts` (easeOutExpo, fadeUp, stagger, drawLineX/Y, imageReveal, curtain, viewportDefault), `src/lib/placeholder-assets.ts` (Unsplash hotlinks for runway/12 women/10 men/editorial pool/6 events/10 client wordmarks/5 press logos/founder portrait/3 past discoveries), `src/lib/supabase.ts` (returns `null` if env unset — no crash), `src/hooks/useScrolled.ts`.
- ✅ **0.6** `BrowserRouter` wired in `main.tsx`, all 11 routes defined in `App.tsx` under a `Layout` parent route, 10 stub pages created in `src/pages/` (each shows page name in Playfair + "Phase 0 — Stub" eyebrow), `src/components/layout/Layout.tsx` is an empty shell with `<Outlet />` ready for Phase 2 nav/footer.

### Phase 0 deviations from original plan
1. **shadcn `form` skipped** — not in `radix-nova` registry. Phase 8 will use `react-hook-form` + `zod` directly with our editorial underline inputs (cleaner, no shadcn `<Form>` wrapper to strip).
2. **No Button variants for `pbm-link` / `pbm-bar`** — defined as plain CSS utility classes in `index.css` instead, applied directly to `<a>` and `<button>`.
3. **No commits yet.** Phase 0 work is staged/uncommitted in the working tree. The user will commit at a checkpoint of their choosing.

### Phase 1 Progress Log
- ✅ **1.1** Replaced `src/pages/StyleGuide.tsx` stub with the full visual system reference page covering all 8 sections from Screen J: header, color palette, type scale (Playfair 160→24px responsive + Inter body 18→12px), logo lockups, interactive library, input library (5 states), spacing scale + 12-col grid, Lucide icon row, sign-off footer.
- ✅ Real brand logos copied from `/Logo` → `public/images/logos/{pb-associates,pb-models}.png` and centralized in `src/lib/placeholder-assets.ts` as `brandLogos`. Style guide § 03 uses `<img>` tags pointing at those paths.
- ✅ User reviewed at desktop (1440) and mobile (375) and signed off the layout, type scale, and gold tone.

### Phase 1 deviations from original plan
1. **`Section` wrapper has no scroll-triggered motion.** Initial implementation used `whileInView`, which kept sections invisible in Playwright full-page screenshots (Framer's IntersectionObserver only fires on real viewport scroll, not screenshot stitching). Switched to plain `<section>` — only the header animates on mount. Reference pages should be calm anyway.
2. **Lucide brand icons missing.** `lucide-react@1.8` strips Instagram/LinkedIn for trademark reasons. Inlined `InstagramGlyph` and `LinkedinGlyph` as tiny local SVG components in `StyleGuide.tsx` — will be lifted into `src/components/icons/` when Phase 2 footer needs them.
3. **Brand mark accent magenta.** The Associates logo has a baked-in `~#e6007e` magenta bar. **Decision: keep it logo-only** — gold remains the only site accent. No `--color-brand-magenta` token added. Visual-system spec is unchanged. The magenta exists exclusively inside the supplied PNG.
4. **Type scale labels updated** to read "160px desktop" etc. — clarifies that mobile sizes are clamped (per CLAUDE.md cap of 56px on mobile).

### Phase 2 Progress Log
- ✅ **2.1** `src/components/layout/Nav.tsx` — three-zone fixed nav with `useScrolled`, animated height (112 → 72 px) and bg color, NavLink-driven active gold underline, hover-driven gold underline draw-in via `group`/scale-x animation, hamburger button on `<lg`. Three-zone wordmark layout uses stacked Playfair text per spec (no PNG — see deviation #1).
- ✅ **2.2** `src/components/layout/ModelsDropdown.tsx` — dark full-width dropdown sliding from nav with 12-col grid: two grayscale model previews (cols 1–5), three Playfair text links with arrow shifts (cols 7–9), Featured This Month list (cols 10–12), full-roster CTA right-aligned with hairline divider. Dropdown is suppressed when already on `/models`.
- ✅ **2.3** `src/components/layout/MobileMenu.tsx` — Sheet from right, full-viewport `#0a0a0a`, PB. monogram in gold top-left, custom × close, numbered Playfair menu items (01–06) with gold prefixes, hairline dividers, expandable Models with `+`/`−` toggle and tracked-caps sub-items, pinned-bottom FOLLOW + city list. Added `SheetDescription` to satisfy Radix `aria-describedby` requirement.
- ✅ **2.4** `src/components/layout/Footer.tsx` — desktop two-col dark footer per Screen 1 spec (Playfair "Prasad / Bidapa." stacked logo + STUDIO address left; The House / The Work / Follow nav columns + newsletter form right; copyright + "Crafted in Bengaluru" hairline row). Mobile stacked-vertical layout per F2 spec, separator-driven sequence: logo → address → newsletter → nav → socials → © row.
- ✅ **2.5** `src/components/layout/PageTransition.tsx` — fixed full-viewport ink curtain, mounted via `key={location.pathname}`, starts covering at `y: 0` with PB. monogram + drawn-gold-line + "LOADING" label visible, holds 350 ms, then sweeps to `y: -100%` over 900 ms. `pointer-events-none` so the new page is interactive instantly.
- ✅ Layout shell now wires `<Nav />`, `<Outlet />`, `<Footer />`, `<PageTransition />`.

### Phase 2 deviations from original plan
1. **Nav defaults to solid dark on every non-`/` route.** Original spec implied transparent-over-hero everywhere, but transparent state over light pages renders the off-white wordmark text invisible. Solid dark-on-all-non-home is the only correct interpretation. Transparent state still applies on `/` until scroll past 80 px.
2. **Brand PNG logos not used in nav / footer / mobile menu.** Supplied logos (`/Logo/Prasad Bidappa Associates.png` and `…Models.png`) are dark-on-light only. Every dark-context surface in Phase 2 (nav over hero, scrolled nav, footer, mobile menu) requires a light/inverted PNG that has not been supplied. Used the spec's text wordmark fallback (stacked Playfair) so the chrome ships now; a one-line swap will replace text wordmarks with `<img src={brandLogos.*}>` once inverted assets exist.
3. **Right wordmark hidden on `<lg`** (mobile/tablet). 375 px doesn't fit two stacked wordmarks plus a hamburger — A2 spec only references the left wordmark + hamburger on mobile.
4. **Page transition is a one-way reveal**, not a sweep-in-then-sweep-out. The original H1 spec reads two ways — a "panel sweeping in from bottom covering bottom 70%" plus a separate "loader" frame. Implementing both as a multi-stage keyframe with route-content swap during the hold required either an awkward portal-managed AnimatePresence dance or accepting a flash of the new page during the cover phase. Chose the simpler editorial pattern: new route mounts immediately, curtain starts fully covering, holds 350 ms with monogram visible, then sweeps off the top revealing the new page. Same total ~1.25 s, simpler implementation, no flash.
5. **No Framer Motion `AnimatePresence` wrapping `<Outlet />`.** Re-keying the transition by `location.pathname` is sufficient and avoids the rendering subtleties of mode="wait" with a curtain.

### Phase 6 Progress Log
- ✅ **6.1** Replaced `src/pages/Events.tsx` stub with the full Screen 4 layout: 50vh header (eyebrow "PRASAD BIDAPA ASSOCIATES · SINCE 1985" + 200px Playfair "Events."), sticky tab bar (FLAGSHIP · UPCOMING · PAST · RECURRING) with animated gold underline. Tab state is local; `top-[72px]` clears the scrolled nav.
- ✅ **6.2** New `src/components/sections/MegaModelHuntFeature.tsx` — 21:9 landscape hero with bottom gradient, two-col body: stacked 120px Playfair "Mega / Model / Hunt." + gold "THE FLAGSHIP · 22 EDITIONS" eyebrow on the left, intro paragraph + 4-col stats row (22 / 8,000+ / 150+ / 6) + "APPLY FOR 2026 EDITION →" CTA on the right. Wired into Events.tsx, only renders on the Flagship tab.
- ✅ **6.3** Rewrote `src/components/EventCard.tsx` for full E2 hover: 8px image lift, date → gold, gold underline draw on VIEW (manual scale-x span — `.pbm-link::after` self-hover wouldn't fire from group hover), faint ground-reference shadow (the only shadow allowed by spec), "01 / 04" pagination indicator fading in top-right of image (via new optional `index` + `total` props). Image aspect ratio bumped from 3:4 → 4:5 to match Screen 4 / E2 spec. Events.tsx grid is 3-col desktop / 1-col mobile, filters by tab type, with E3 empty state for tabs that yield zero events.
- ✅ **6.4** Replaced `src/pages/EventDetail.tsx` stub with the full E1 layout: 80vh hero with dark gradient + bottom-left content block (gold eyebrow, 120px Playfair title, hero city row, 32px gold date), asymmetric 12-col body (sticky 4-col meta sidebar with 6 rows + REGISTER FOR AUDITIONS bar; offset 7-col long-form right with About / Past Discoveries 3-col grayscale grid / City Schedule table). AS SEEN IN press strip with grayscale wordmarks. Related events grid + "All events →" link at the bottom.
- ✅ Final build clean: 83.28 kB CSS / 515.54 kB JS / 2.42 s.

### Phase 6 deviations from original plan
1. **Slider-vs-gallery A/B left in place** (Phase 5 carryover). User explicitly chose to keep `ModelDetail.tsx` rendering both `EditorialGallery` (Women) and `EditorialSlider` (Men) side-by-side rather than collapse before Phase 6. Decision still open — first thing for the Phase 6 checkpoint review.
2. **Tab content interpretation.** The visual-system spec describes "Flagship section (default view)" but doesn't define what the other tabs show. Implemented: FLAGSHIP = `MegaModelHuntFeature` + "Other properties." grid (every non-flagship event); UPCOMING / PAST / RECURRING = filtered grid only, no flagship feature. E3 empty state used when a filter yields zero.
3. **EventDetail body content is flagship-anchored regardless of slug.** The spec's body content (Past Discoveries, City Schedule, AS SEEN IN press, "About the Hunt") is Mega Model Hunt-specific. Since the events array only carries title/cover/date/city/type, the page falls back to MMH content for every slug while UI is being shaped. Per-event copy lands in Phase 12.
4. **EventCard `.pbm-link` swap.** The shared `.pbm-link::after` underline animates on the link's own `:hover` — that doesn't fire when the user hovers anywhere else inside the parent group (e.g. the image). Replaced VIEW's `pbm-link` with a manual `<span>` + scaled `bg-gold` underline so the draw triggers on `group-hover`. Net: same look, but driven by the parent card hover instead of just the link's bounding box.
5. **Faint ground shadow** on EventCard hover is implemented as a blurred `radial-gradient` div pinned to the bottom of the image, opacity 0 → 30% on group-hover. Stays within the "no shadows except event card hover" spec exemption.
6. **Sticky tab bar offset = `top-[72px]`** to clear the scrolled-nav height. Worth eyeballing in the browser — if the unscrolled 112px nav state ever overlaps it during the brief transition window, this needs to bump up.

---

## 🚀 Resume in next session — bootstrap checklist

**Read these files first (in order) to load context:**
1. `CLAUDE.md` — durable instructions, design system rules, Stitch reference mapping, workflow rules
2. `docs/design/visual-system.md` — full per-screen design spec (Screen 5 for Phase 7)
3. `docs/plans/2026-04-13-pbm-website-ui-build.md` (this file) — plan + progress log
4. `Design-Reference/stitch/about_us_desktop/screen.png`, `about_us_signature_ips_updated/screen.png`, `heritage_editorial/screen.png` — Stitch's takes on About (Phase 7)
5. `src/index.css` — to know what's already in `@theme` and which utility classes exist
6. `src/lib/placeholder-assets.ts` — already exposes `founderPortrait`, `pastDiscoveries`, `clientLogos`, `events` for About sections

**Verify the build still works:**
```bash
cd "C:/Users/Pc/Desktop/4AM Projects/PBM/PBM/PBM/prasad-bidapa-website"
npm run build
```
Expect: clean build, ~2.4s. Last known good: 83.28 kB CSS / 515.54 kB JS.

**Start dev server:**
```bash
npm run dev
```
Visit `http://localhost:5173/events` and `http://localhost:5173/events/mega-model-hunt-2026` to confirm Phase 6 still renders before moving on.

**Outstanding Phase 5/6 checkpoint items (resolve before Phase 7):**
- **Slider vs gallery decision** — `src/pages/ModelDetail.tsx` still renders `EditorialSlider` for Men and `EditorialGallery` for Women. Pick one, collapse the conditional, delete the loser component.
- **Phase 6 visual review** — Playwright screenshots at 375 / 768 / 1440 of `/events` (all four tabs) and `/events/mega-model-hunt-2026`. Verify sticky tab bar doesn't overlap the unscrolled nav, E2 hover animations feel right, ground shadow is subtle enough.

**Then begin Phase 7 — About:**
- Re-read this file's "Phase 7 — About" section
- Open the three Stitch about screenshots above for layout reference (do not copy)
- Replace the `src/pages/About.tsx` stub with the hero + 5 sections per Screen 5 spec (Associates → Models → Founder full-bleed dark → Properties grid → Team)
- Create the 5 section components under `src/components/sections/` (`AboutAssociates`, `AboutModels`, `AboutFounder`, `AboutProperties`, `AboutTeam`)
- Pause at the Phase 7 Checkpoint for user review

**Asset patterns already defined and ready to use:**
- `import { ... } from "@/lib/placeholder-assets"` — Unsplash hotlinks
- `import { fadeUp, stagger, easeOutExpo } from "@/lib/motion"` — Framer Motion variants
- `import { useScrolled } from "@/hooks/useScrolled"` — nav scroll state
- Tailwind utilities: `bg-paper`, `text-ink`, `text-gold`, `text-mute`, `border-hairline`, `font-display`, `font-sans`, `tracking-[0.2em]`, `pbm-link`, `pbm-bar`
- shadcn `cn()` helper: `import { cn } from "@/lib/utils"`

---

**Goal:** Ship a magazine-quality, editorial luxury fashion-agency website for Prasad Bidapa Models & Associates, matching the visual system in `docs/design/visual-system.md`. UI-only in this plan; functionality is a separate phase.

**Architecture:** Vite + React 19 + TypeScript + Tailwind v4 (CSS-first `@theme`) + Framer Motion 12 + react-router v7. shadcn/ui primitives heavily overridden to remove rounded corners, shadows, and SaaS defaults. One route component per screen, reusable section components for repeated layouts.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind v4, Framer Motion 12, react-router-dom v7, shadcn/ui (v4 mode), lucide-react, Playwright (via plugin) for visual verification.

**Workflow constraint (durable):** UI-first. No Supabase schemas, form handlers, or data fetching until UI is complete and explicitly approved. See `CLAUDE.md`.

**Visual constraint reminder:**
- 0px border-radius EVERYWHERE
- No shadows (one exception: faint ground shadow on event card hover)
- No rounded buttons — text-link with underline OR full-width black bar
- Asymmetric grids, hairline dividers, full-bleed photography
- Playfair Display headlines (96–160px), Inter body
- Colors: `#0a0a0a` ink, `#fafaf7` paper, `#c9a961` gold, `#8a8a85` mute

**Asset strategy:** Unsplash editorial fashion hotlinks during UI build. Curated list lives in `src/lib/placeholder-assets.ts` so swaps are centralized.

**Visual references:** `Design-Reference/stitch/` contains 23 Google Stitch outputs covering every screen — each folder has `code.html` + `screen.png`. Before starting any screen task, **view the corresponding screenshot** to check Stitch's layout proportions and grid choices. Do NOT copy Stitch's HTML or imagery — Stitch's photos are AI-generated and uncanny, its headlines are conservative (60–80px instead of the spec's 96–200px), and its gold tone drifts toward mustard. The Stitch refs are **baselines to beat**, not blueprints to follow. See the mapping in `CLAUDE.md`.

**Verification approach:** After each major screen, take Playwright screenshots at 375px and 1440px, compare them side-by-side against the Stitch reference for the same screen (the user will be looking at this comparison too), and pause for user review before continuing. No unit tests on visual code — they don't catch the things that matter for editorial design.

---

## Phase 0 — Foundation Setup

Goal: Get Tailwind v4 theme, fonts, shadcn primitives, lib utilities, and routing scaffold in place. No visible UI yet.

### Task 0.1: Tailwind v4 theme tokens + Google Fonts + base CSS

**Files:**
- Modify: `src/index.css` (full rewrite)

**Action:** Replace `src/index.css` with:
1. `@import "tailwindcss";`
2. `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,400&display=swap");`
3. `@theme` block defining:
   - `--color-ink: #0a0a0a`
   - `--color-paper: #fafaf7`
   - `--color-gold: #c9a961`
   - `--color-mute: #8a8a85`
   - `--color-error: #8b1a1a`
   - `--color-hairline: rgb(10 10 10 / 0.15)`
   - `--color-hairline-inverse: rgb(250 250 247 / 0.15)`
   - `--font-display: "Playfair Display", Georgia, serif`
   - `--font-sans: "Inter", system-ui, sans-serif`
   - `--radius: 0px` (override any defaults)
4. Base layer:
   - `html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }`
   - `body { background: var(--color-paper); color: var(--color-ink); font-family: var(--font-sans); letter-spacing: 0.02em; }`
   - `*, *::before, *::after { border-radius: 0 !important; }` — defensive, kills any third-party rounding
   - Selection color: gold on ink

**Verification:** `npm run dev` → page loads with Inter body font, no errors in console.

**Commit:** `chore: tailwind v4 theme tokens, fonts, base styles`

### Task 0.2: shadcn/ui init (v4 mode)

**Files:**
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/` (will be populated)

**Action:**
1. Run: `npx shadcn@latest init` from `prasad-bidapa-website/`
2. Answer prompts:
   - Style: `new-york` (more editorial than `default`)
   - Base color: `stone` (neutral, won't fight our palette)
   - CSS variables: `yes`
3. If init fails on React 19 peer deps: re-run with `--legacy-peer-deps`.
4. Verify `components.json` exists, `src/lib/utils.ts` has `cn` helper, alias paths work.

**Commit:** `chore: shadcn/ui init for tailwind v4`

### Task 0.3: Install shadcn primitive components

**Files:**
- Create: `src/components/ui/button.tsx`, `dialog.tsx`, `sheet.tsx`, `form.tsx`, `input.tsx`, `textarea.tsx`, `navigation-menu.tsx`, `carousel.tsx`, `card.tsx`

**Action:**
Run: `npx shadcn@latest add button dialog sheet form input textarea navigation-menu carousel card --yes`
(retry with `--legacy-peer-deps` if needed)

**Note:** Defaults will have rounded corners and shadows. We will override them in Task 0.4 — do NOT use these primitives directly in pages without overrides.

**Commit:** `chore: add shadcn primitives`

### Task 0.4: Override shadcn defaults to enforce visual system

**Files:**
- Modify: `src/components/ui/button.tsx`, `dialog.tsx`, `input.tsx`, `textarea.tsx`, `card.tsx`

**Action:** Edit each file to:
- Remove ALL `rounded-*` classes
- Remove ALL `shadow-*` classes
- Remove ALL `border` classes from button (text-link only)
- Add a new button variant `pbm-link` (text + underline draw-in) and `pbm-bar` (full-width black bar)
- Remove the default `border` on `input.tsx` — replace with `border-b border-ink` only

Skip if a primitive isn't used until later screens.

**Verification:** `npm run dev`, no visual regressions on the (still empty) page.

**Commit:** `style: override shadcn primitives — no rounded, no shadows, editorial defaults`

### Task 0.5: Library scaffolding — animation presets, placeholder assets, utility helpers

**Files:**
- Create: `src/lib/motion.ts` — exports `easeOutExpo: [0.22, 1, 0.36, 1]`, common variants (`fadeUp`, `staggerChildren`, `drawLine`), durations
- Create: `src/lib/placeholder-assets.ts` — exports curated Unsplash URLs grouped by purpose: `heroVideo`, `runwayShots[]`, `femaleModels[]`, `maleModels[]`, `editorial[]`, `events[]`, `clientLogos[]`. Each URL with a `?w=1600&q=80&auto=format&fit=crop` suffix.
- Create: `src/lib/supabase.ts` — env-driven client factory (NOT used yet, but ready)
- Create: `src/hooks/useScrolled.ts` — detects `scrollY > 100` for nav state

**Action:** Implement each file. For `placeholder-assets.ts`, pick ~20 fashion editorial photos from Unsplash by URL — portrait runway/B&W/editorial themes. Use real photographer URLs.

**Verification:** TypeScript compiles, `npm run lint` passes.

**Commit:** `feat: lib scaffolding — motion presets, placeholder assets, hooks`

### Task 0.6: Routing scaffold + Layout shell

**Files:**
- Modify: `src/main.tsx` — wrap App in `BrowserRouter`
- Modify: `src/App.tsx` — define `<Routes>` with placeholders for `/`, `/style-guide`, `/models`, `/models/female`, `/models/male`, `/models/:slug`, `/events`, `/events/:slug`, `/about`, `/become-a-model`, `/contact`, `*` (404)
- Create: `src/components/layout/Layout.tsx` — empty shell that renders `<Outlet />` (Nav + Footer added later)
- Create: `src/pages/` — empty stub components for each route returning a single `<main>` with the page name

**Verification:** Navigate to each route in the browser, see the stub.

**Commit:** `feat: routing scaffold and layout shell`

### Phase 0 Checkpoint
**Pause and report to user.** Show:
- `npm run dev` works
- Routes navigable
- Theme tokens visible (font is Inter, background is `#fafaf7`)

User confirms before Phase 1.

---

## Phase 1 — Style Guide Page (Screen J)

Goal: Build the visual system reference sheet as a real page at `/style-guide`. Doubles as proof the design system works in code.

### Task 1.1: Style guide page scaffold

**Files:**
- Modify: `src/pages/StyleGuide.tsx`

**Action:** Build the page sections per Screen J of `docs/design/visual-system.md`:
1. Page title — Playfair "Prasad Bidapa — Visual System."
2. Color palette swatches (4 large squares with hex labels)
3. Typography scale (Playfair sizes 160 / 96 / 72 / 48 / 32 / 24 + Inter sizes)
4. Logo lockups — text-based wordmarks for both brands + "PB" monogram
5. Button & link library — all 6 variants
6. Form input library — default / focused / error / filled / disabled
7. Spacing scale visual
8. Grid system overlay
9. Lucide icon row at 20px

Use only hairline dividers between sections. No colored boxes.

**Verification:** Visit `/style-guide` → all 8 sections render with correct fonts, colors, and zero rounded corners. Run Playwright (chromium plugin) to take desktop + mobile screenshots and self-review.

**Commit:** `feat(style-guide): visual system reference page`

### Phase 1 Checkpoint
**Pause and report to user with screenshots.** User confirms typography, colors, and overall feel before we proceed.

---

## Phase 2 — Layout: Nav, Footer, Page Transition

Goal: Build the persistent chrome.

### Task 2.1: Nav component (transparent + scrolled states)

**Files:**
- Create: `src/components/layout/Nav.tsx`
- Modify: `src/components/layout/Layout.tsx`

**Action:**
- Three-zone sticky nav (left wordmark / center links / right wordmark) per Screen 1 spec
- Two stacked-line wordmarks: "PRASAD BIDAPA / ASSOCIATES" and "PRASAD BIDAPA / MODELS"
- Center links: HOME · MODELS ▾ · EVENTS · BECOME A MODEL · ABOUT · CONTACT (Inter all-caps 12px tracked 0.2em)
- Use `useScrolled` hook → toggle transparent (over hero) vs solid `#0a0a0a` after 100px
- Animate height compress 120px → 80px on scroll (Framer Motion)
- Active route gets thin gold underline
- Each link: text-link with underline draw-in on hover

**Verification:** On homepage stub, scroll → nav transitions transparent → solid. Hover links → gold underline draws.

**Commit:** `feat(layout): nav with transparent/scrolled states`

### Task 2.2: Models dropdown (desktop) — A1

**Files:**
- Create: `src/components/layout/ModelsDropdown.tsx`
- Modify: `src/components/layout/Nav.tsx` (wire dropdown to MODELS link hover)

**Action:** Per spec A1 — full-viewport-width panel sliding down from nav, 12-col grid with two model preview images, three Playfair links (Women / Men / New Faces), Featured This Month list, "VIEW THE FULL ROSTER →" footer.

**Verification:** Hover MODELS → dropdown slides down. Tab navigation works.

**Commit:** `feat(layout): desktop models dropdown`

### Task 2.3: Mobile hamburger menu (Sheet) — A2

**Files:**
- Create: `src/components/layout/MobileMenu.tsx`
- Modify: `src/components/layout/Nav.tsx` (hamburger icon visible <md, opens Sheet)

**Action:** Per spec A2 — Sheet slides from right, full-height `#0a0a0a`, Playfair "PB" monogram top-left in gold, × top-right, vertical nav links Playfair 36px with gold "01 / 02..." prefixes, hairline dividers, MODELS expandable to sub-items, pinned bottom with FOLLOW + city list.

**Verification:** Resize to 375px → hamburger appears → tap → menu slides in.

**Commit:** `feat(layout): mobile hamburger menu`

### Task 2.4: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/Layout.tsx`

**Action:** Per Screen 1 footer + F2 mobile spec.
- Desktop: two-col `#0a0a0a` background, Playfair logo + Bengaluru address left, nav links + socials + newsletter input right, bottom hairline copyright row
- Mobile: stacked vertical per F2

**Verification:** Footer visible on every page at both 375px and 1440px.

**Commit:** `feat(layout): footer desktop + mobile`

### Task 2.5: Page transition (H1 — curtain sweep)

**Files:**
- Create: `src/components/layout/PageTransition.tsx`
- Modify: `src/components/layout/Layout.tsx` (wrap `<Outlet />` with `AnimatePresence`)

**Action:** Black curtain sweeps up from bottom on route change, 600ms, ease-out-expo. PB monogram + animating gold line "loading" indicator during peak of transition.

**Verification:** Click between routes → curtain sweep visible.

**Commit:** `feat(layout): page transition curtain`

### Phase 2 Checkpoint
**Pause and report to user with screenshots of nav (both states), dropdown, mobile menu, footer.** User confirms before homepage build.

---

## Phase 3 — Homepage (Screen 1)

Goal: The flagship page. Six folds plus hero. This is the validation moment for the whole design system.

### Task 3.1: Hero fold

**Files:**
- Create: `src/components/sections/HomeHero.tsx`
- Modify: `src/pages/Home.tsx`

**Action:** Per Screen 1 hero spec.
- Full-bleed `<video autoplay muted loop playsinline>` background using a Coverr/Pexels runway clip URL from `placeholder-assets.ts`. Poster image fallback.
- Dark gradient overlay (60% black bottom → 20% black top)
- Bottom-left content: gold eyebrow "EST. 1985 · BENGALURU", Playfair "Faces that / define fashion." (140px desktop / 56px mobile, line-height 0.95, white)
- Thin "DISCOVER →" link with magnetic hover effect
- Bottom-right: vertical "SCROLL" text with thin animating line (Framer Motion repeating)
- Stagger fade-in on mount

**Verification:** Visit `/`, hero loads, video plays, headline animates in. Take Playwright screenshot.

**Commit:** `feat(home): hero fold with video and editorial headline`

### Task 3.2: Fold 2 — About Prasad Bidapa

**Files:**
- Create: `src/components/sections/HomeAbout.tsx`
- Modify: `src/pages/Home.tsx`

**Action:** Per Screen 1 Fold 2 spec.
- 160px vertical padding, off-white
- Left 5 cols: tall B&W portrait of Prasad Bidapa (placeholder Unsplash editorial portrait)
- Right 6 cols offset down 80px: gold label "THE MENTOR", Playfair "Four decades / shaping Indian / fashion." (72px), two Inter paragraphs mentioning the supermodels, gold italic pull-quote "India's master artisans are our national treasures.", thin "READ THE STORY →" link
- Scroll-triggered fade-up animations

**Commit:** `feat(home): about prasad bidapa fold`

### Task 3.3: Fold 3 — Prasad Bidapa Models (dark)

**Files:**
- Create: `src/components/sections/HomeModelsTeaser.tsx`
- Modify: `src/pages/Home.tsx`

**Action:** Per Screen 1 Fold 3 spec.
- Full-bleed dark `#0a0a0a`, 100vh
- Right: three-image asymmetric collage (one tall, two stacked) — use editorial portraits
- Left: gold "01 / THE AGENCY", Playfair off-white "The faces / behind the / brands." (96px), short paragraph, "MEET THE MODELS →" link → `/models/female`

**Commit:** `feat(home): prasad bidapa models teaser fold`

### Task 3.4: Fold 4 — Prasad Bidapa Associates (mirrored)

**Files:**
- Create: `src/components/sections/HomeAssociatesTeaser.tsx`
- Modify: `src/pages/Home.tsx`

**Action:** Mirrored layout per Screen 1 Fold 4 spec. Image collage left, text right. "02 / THE EVENTS", "Where talent / is discovered.", mention Mega Model Hunt, "EXPLORE EVENTS →" → `/events`

**Commit:** `feat(home): prasad bidapa associates teaser fold`

### Task 3.5: Fold 5 — Clients marquee

**Files:**
- Create: `src/components/sections/HomeClientsMarquee.tsx`
- Modify: `src/pages/Home.tsx`

**Action:** Per Screen 1 Fold 5 spec.
- White background, 120px tall, hairline above + below
- "TRUSTED BY" centered tracked small caps label
- Single horizontal row of 8–10 grayscale client logos using SVG text wordmarks (placeholder fashion brand names: "Sabyasachi", "Manish Malhotra", "Tarun Tahiliani", "Ritu Kumar", "Anita Dongre", "Raghavendra Rathore", "Rohit Bal", "Tarun Tahiliani", "Falguni Shane Peacock", "Gauri & Nainika")
- Framer Motion infinite linear marquee, smooth, no pause on hover

**Commit:** `feat(home): clients marquee`

### Task 3.6: Fold 6 — Events horizontal scroll

**Files:**
- Create: `src/components/sections/HomeEventsScroll.tsx`
- Create: `src/components/EventCard.tsx` (reusable)
- Modify: `src/pages/Home.tsx`

**Action:** Per Screen 1 Fold 6 spec.
- Off-white. Section header "UPCOMING & RECENT" Playfair 56px left-aligned
- Horizontal scroll row of 4 large event cards (3:4 ratio images, Playfair date, title, location, "VIEW →" link)
- Smooth scroll, no scroll bar, drag/swipe gesture support
- Hover lift effect per E2

**Commit:** `feat(home): events horizontal scroll`

### Phase 3 Checkpoint
**Major checkpoint.** Full Playwright screenshots at 375px, 768px, 1440px. Pause for user review of the entire homepage. User must approve before any other screen.

---

## Phase 4 — Models Listing (Screen 2)

### Task 4.1: Models page header

**Files:**
- Create: `src/pages/ModelsList.tsx`
- Modify: `src/App.tsx` (`/models/female` and `/models/male` routes share this component, gender from params)

**Action:** Per Screen 2 page header spec.
- 60vh off-white
- Massive Playfair "Women." or "Men." (200px), eyebrow "01 — THE ROSTER · 47 TALENTS"
- Filter bar: "ALL · NEW FACES · MAINBOARD · DEVELOPMENT · DIGITAL", active in gold underline (B3)

**Commit:** `feat(models): page header with filter bar`

### Task 4.2: Models asymmetric masonry grid

**Files:**
- Create: `src/components/ModelCard.tsx`
- Modify: `src/pages/ModelsList.tsx`

**Action:**
- Build asymmetric masonry per Screen 2 spec — three card sizes (large 2x, medium 1x, tall 1x-tall) over 4-col desktop / 2-col mobile
- 8px gutters, full-bleed photos, no borders
- Card content: name (Playfair 24px), "VIEW →"
- Hover state per B1: desaturate, gold line under name, "VIEW PORTFOLIO" overlay text appears, arrow shifts 4px right
- Use Unsplash placeholder portraits from `placeholder-assets.ts`
- Click → `/models/:slug` (slug from placeholder data)

**Commit:** `feat(models): asymmetric masonry grid with hover states`

### Task 4.3: Pagination

**Files:**
- Create: `src/components/Pagination.tsx`
- Modify: `src/pages/ModelsList.tsx`

**Action:** Centered "01 / 04" minimal text + thin arrows per spec.

**Commit:** `feat(models): pagination control`

### Phase 4 Checkpoint
**Pause for review.** Screenshots of /models/female and /models/male at all breakpoints.

---

## Phase 5 — Model Detail (Screen 3) + Inquiry Dialog States

### Task 5.1: Model detail hero (60/40 split)

**Files:**
- Create: `src/pages/ModelDetail.tsx`

**Action:** Per Screen 3 hero spec.
- Left 60%: full viewport-height editorial portrait
- Right 40%: off-white panel with eyebrow "WOMEN · MAINBOARD", massive Playfair name stacked (88px), thin gold divider, two-col stats table (HEIGHT, BUST, WAIST, HIPS, HAIR, EYES, SHOES, LOCATION) Inter 14px label-grey/value-black
- Solid black full-width "INQUIRE ABOUT THIS MODEL →" CTA bar
- Thin "DOWNLOAD DIGITALS ↓" link

**Commit:** `feat(model-detail): split hero with stats`

### Task 5.2: Editorial gallery section

**Files:**
- Modify: `src/pages/ModelDetail.tsx`
- Create: `src/components/EditorialGallery.tsx`

**Action:** Asymmetric editorial layout per Screen 3 — full-bleed → two-up → centered 60% → three-up → repeat. 12+ images. 4px gutters. Lightbox on click (use H2 component, built later in Phase 10 — placeholder for now).

**Commit:** `feat(model-detail): editorial asymmetric gallery`

### Task 5.3: Inquiry dialog — default (C1)

**Files:**
- Create: `src/components/dialogs/InquiryDialog.tsx`
- Modify: `src/pages/ModelDetail.tsx` (wire CTA to open)

**Action:** Per Screen 3 dialog + C1 spec. Centered modal, 70% black backdrop, 480px wide, off-white background. Underline-only inputs (Name, Company, Email, Phone, Project Details textarea, Estimated Dates). Solid black full-width submit. NO functionality — local state only, button does nothing yet.

**Commit:** `feat(inquiry): default dialog UI`

### Task 5.4: Inquiry submitting / success / error states (C2-C4)

**Files:**
- Modify: `src/components/dialogs/InquiryDialog.tsx`

**Action:** Add state machine `idle | submitting | success | error`. Demo toggle in dev only (URL param `?state=success` etc.) so user can preview each state. Build C2 (50% opacity inputs, "SENDING..." with animating dots), C3 (gold line + Playfair "Inquiry sent." + 24h copy + CONTINUE BROWSING link), C4 (red hairline error strip).

**Commit:** `feat(inquiry): submitting/success/error states`

### Phase 5 Checkpoint
**Pause for review.** Screenshots of detail page + each dialog state.

---

## Phase 6 — Events (Screen 4) + Event Detail (E1) + Card Hover (E2)

### Task 6.1: Events page header + tab bar

**Files:**
- Create: `src/pages/Events.tsx`

**Action:** Per Screen 4 spec. 50vh header, Playfair "Events." (200px), eyebrow "PRASAD BIDAPA ASSOCIATES · SINCE 1985". Sticky tab bar: FLAGSHIP · UPCOMING · PAST · RECURRING. Active gold underline.

**Commit:** `feat(events): header and tab bar`

### Task 6.2: Flagship section — Mega Model Hunt

**Files:**
- Create: `src/components/sections/MegaModelHuntFeature.tsx`
- Modify: `src/pages/Events.tsx`

**Action:** Per Screen 4 flagship spec. Landscape hero image of runway show, two-col below: left Playfair "Mega / Model / Hunt." stacked (120px) with "THE FLAGSHIP · 22 EDITIONS"; right paragraph + stats row (22 EDITIONS · 8,000+ AUDITIONS · 150+ SIGNED · 6 CITIES) with large Playfair numbers / tiny labels. CTA "APPLY FOR 2026 EDITION →".

**Commit:** `feat(events): mega model hunt flagship feature`

### Task 6.3: Other events grid + E2 hover state

**Files:**
- Modify: `src/components/EventCard.tsx` (add hover state per E2: lift 8px, date → gold, gold underline draw, "01 / 04" indicator appears)
- Modify: `src/pages/Events.tsx`

**Action:** 3-col desktop / 1-col mobile grid using `EventCard`. Placeholder events: India Men's Fashion Week, Colombo Fashion Week, Kingfisher Fashion Awards, Rajasthan Heritage Week, LUXO Luxury Weeks.

**Commit:** `feat(events): other events grid + card hover`

### Task 6.4: Event detail page (E1)

**Files:**
- Create: `src/pages/EventDetail.tsx`

**Action:** Per E1 spec. 80vh hero with gradient overlay, gold "FLAGSHIP · 23rd EDITION", Playfair "Mega Model / Hunt 2026." (120px), city list, date "MARCH — JUNE 2026" Playfair 32px gold. Body: sticky meta sidebar (4 cols) + long-form right (7 cols) with About, Past Discoveries grid (Deepika/Anushka/Lara B&W portraits), City Schedule table. Press strip with 5 grayscale press logos. Related events grid bottom.

**Commit:** `feat(event-detail): full event detail page`

### Phase 6 Checkpoint
**Pause for review.** Screenshots of /events and /events/mega-model-hunt.

---

## Phase 7 — About (Screen 5)

### Task 7.1: About hero + 5 sections

**Files:**
- Create: `src/pages/About.tsx`
- Create: `src/components/sections/AboutAssociates.tsx`, `AboutModels.tsx`, `AboutFounder.tsx`, `AboutProperties.tsx`, `AboutTeam.tsx`

**Action:**
- Hero: 80vh off-white, eyebrow + Playfair "A house of / fashion, talent / and craft." (120px), 2-line manifesto right
- Section 1 (Associates): asymmetric two-col, photo grid left, label "01" + "The Associates." + paragraphs + services list right
- Section 2 (Models): mirrored, "The Models."
- Section 3 (Founder): full-bleed dark `#0a0a0a`, large vertical portrait right, gold "THE FOUNDER" + Playfair "Prasad Bidapa." (96px) + bio paragraphs left
- Section 4 (Properties): off-white, 4-col grid (2-col mobile) of property cards (Mega Model Hunt, IMFW, CFW, Rajasthan Heritage Week, LUXO, Kingfisher Fashion Awards)
- Section 5 (Team): off-white asymmetric grid of 6–10 team members, portrait + name + role

**Commit:** `feat(about): hero and 5 editorial sections`

### Phase 7 Checkpoint
**Pause for review.**

---

## Phase 8 — Become a Model (Screen 6) + Form States (D1-D4)

### Task 8.1: Become a Model hero

**Files:**
- Create: `src/pages/BecomeAModel.tsx`

**Action:** Per Screen 6 hero spec. 70vh, "Be / Discovered." (160px) left, paragraph right offset, "BEGIN APPLICATION ↓" scroll cue.

**Commit:** `feat(become-a-model): hero section`

### Task 8.2: Multi-step form skeleton + step 1 (Personal)

**Files:**
- Create: `src/components/forms/ApplicationForm.tsx`
- Create: `src/components/forms/StepIndicator.tsx`
- Modify: `src/pages/BecomeAModel.tsx`

**Action:**
- Max-width 720px centered, off-white
- Progress indicator: "01 — PERSONAL · 02 — MEASUREMENTS · 03 — PHOTOS · 04 — REVIEW"
- Step 1 fields: Full Name, Email, Phone, DOB, Gender (text-radio), City, Instagram — all underline-only inputs
- Local state machine for step navigation. NO submission, NO validation library, NO Supabase.

**Commit:** `feat(become-a-model): step 1 personal`

### Task 8.3: Step 2 — Measurements

**Files:**
- Modify: `src/components/forms/ApplicationForm.tsx`

**Action:** 2-col grid: Height, Bust/Chest, Waist, Hips, Shoes, Hair, Eyes — all underline inputs.

**Commit:** `feat(become-a-model): step 2 measurements`

### Task 8.4: Step 3 — Photos (D2 states)

**Files:**
- Create: `src/components/forms/PhotoUploadStep.tsx`
- Modify: `src/components/forms/ApplicationForm.tsx`

**Action:** Empty state (dashed drop zone), uploading state (4 thumbnails + progress bar), complete-with-error state (× delete, PRIMARY label, red border on invalid). Demo toggle for state preview. NO real upload yet.

**Commit:** `feat(become-a-model): step 3 photos with all states`

### Task 8.5: Step 4 — Review + success screen (D3)

**Files:**
- Modify: `src/components/forms/ApplicationForm.tsx`
- Create: `src/components/forms/ApplicationSuccess.tsx`

**Action:** Step 4: clean two-col table summary + "SUBMIT APPLICATION →" black bar. D3 success screen: full viewport, "APPLICATION RECEIVED · #PB-2026-0247", massive Playfair "Thank you, / Aisha.", paragraph, RETURN HOME link, thin gold vertical line right edge.

**Commit:** `feat(become-a-model): review and success screens`

### Task 8.6: D4 form validation visual states

**Files:**
- Modify: `src/components/forms/Input.tsx` (or `ui/input.tsx`)

**Action:** Add `state` prop: `default | focused | error | filled | disabled`. Focused = 2px gold underline + label gold. Error = red underline + red 12px caption. Match D4 spec exactly. Wire into form fields.

**Commit:** `feat(become-a-model): input validation visual states`

### Phase 8 Checkpoint
**Pause for review.** Screenshots of all 4 steps + success.

---

## Phase 9 — Contact (Screen 7) + Form States (G1-G2)

### Task 9.1: Contact hero + main split

**Files:**
- Create: `src/pages/Contact.tsx`

**Action:** Per Screen 7. 50vh hero "Get in touch." (120px), eyebrow "BENGALURU · MUMBAI · DELHI". 50/50 split: left = three contact blocks (STUDIO/GENERAL/BOOKINGS/PRESS) with tracked labels and Playfair details + Instagram/LinkedIn text links. Right = stylized monochrome map illustration with single black pin (SVG, no Google Maps).

**Commit:** `feat(contact): hero and split contact info`

### Task 9.2: Contact form + dropdown G2 + success G1

**Files:**
- Create: `src/components/forms/ContactForm.tsx`
- Modify: `src/pages/Contact.tsx`

**Action:** Centered 640px form. Underline inputs Name, Email, Subject (custom dropdown styled as text + chevron, NOT native select), Message textarea, full-width black "SEND MESSAGE →". G2: dropdown open state with 4 options (GENERAL INQUIRY, BOOKING REQUEST, PRESS & MEDIA, BECOME A MODEL), hairline dividers, hovered option has tint + gold arrow. G1: success state replaces form ("Message received." + 48h copy + "SEND ANOTHER MESSAGE →").

**Commit:** `feat(contact): form with dropdown and success states`

### Phase 9 Checkpoint
**Pause for review.**

---

## Phase 10 — Global Components

### Task 10.1: 404 page (H4)

**Files:**
- Create: `src/pages/NotFound.tsx`

**Action:** Per H4 spec. Asymmetric: full-bleed empty runway image left, centered right content with "ERROR · 404", Playfair "Page not / found." (120px), paragraph, "← RETURN HOME" link, rotated wordmark bottom-right.

**Commit:** `feat(404): not found page`

### Task 10.2: Image lightbox (H2)

**Files:**
- Create: `src/components/Lightbox.tsx`
- Modify: `src/components/EditorialGallery.tsx` (wire clicks to open)

**Action:** Per H2 spec. Full viewport `#0a0a0a` 95% opacity. Centered portrait max 80% vh. × top-right, "03 / 14" pagination bottom-center, ←/→ arrows side, caption bottom-left. Keyboard nav.

**Commit:** `feat(global): image lightbox`

### Task 10.3: Search overlay (H5)

**Files:**
- Create: `src/components/SearchOverlay.tsx`
- Modify: `src/components/layout/Nav.tsx` (search icon trigger)

**Action:** Per H5 spec. Slides down from top, off-white. × top-right, PB monogram top-left. Single line input with thick 2px ink underline, Playfair 56px, placeholder. QUICK LINKS row + results preview. Empty state.

**Commit:** `feat(global): search overlay`

### Task 10.4: Cookie consent banner (H3)

**Files:**
- Create: `src/components/CookieBanner.tsx`
- Modify: `src/components/layout/Layout.tsx`

**Action:** Per H3 spec. Pinned bottom, 80px tall, `#0a0a0a` background, gold hairline top border. Inter 13px copy with gold-underlined Privacy Policy link. DECLINE / ACCEPT text links right.

**Commit:** `feat(global): cookie consent banner`

### Task 10.5: Toast notification (H6)

**Files:**
- Create: `src/components/Toast.tsx` + `src/hooks/useToast.ts`

**Action:** Per H6 spec. 400 × 80px, pinned bottom-center. `#0a0a0a` bg, 2px gold left border, tracked label + body text + × dismiss. Red variant for errors.

**Commit:** `feat(global): toast notifications`

### Task 10.6: Page loading state (H1)

**Files:**
- Modify: `src/components/layout/PageTransition.tsx`

**Action:** Add explicit loading frame: PB monogram + animating gold line + "LOADING" tracked label. Triggered during route lazy load.

**Commit:** `feat(global): page loading state`

### Phase 10 Checkpoint
**Pause for review.** Demo each global component.

---

## Phase 11 — Responsive Polish & QA Sweep

Goal: Walk every screen at 375 / 768 / 1440 and fix any layout breakage.

### Task 11.1: Responsive audit — homepage

**Action:** Open `/` at all three breakpoints. Fix anything that breaks. Commit fixes per screen.

### Task 11.2: Responsive audit — models list + detail
### Task 11.3: Responsive audit — events list + detail
### Task 11.4: Responsive audit — about, become-a-model, contact
### Task 11.5: Lighthouse pass

**Action:** Run Lighthouse on production build (`npm run build && npm run preview`). Target 90+. Fix offenders (lazy load images, font preload, etc.).

### Phase 11 Checkpoint
**Final pause before functionality work.** User confirms UI is complete.

---

## Phase 12 — Functionality (DEFERRED — DO NOT EXECUTE WITHOUT EXPLICIT USER GO-AHEAD)

Goal: Wire backend. This phase is documented for later. Build steps:
1. Supabase MCP authentication
2. Schema creation: `models`, `model_gallery`, `events`, `clients`, `inquiries`, `model_applications`
3. RLS policies (public read on models/events/clients, public insert on inquiries/applications)
4. Storage bucket `applications` for photo uploads
5. Replace placeholder data in pages with Supabase queries
6. Wire `InquiryDialog` to insert into `inquiries`
7. Wire `ContactForm` to insert into `inquiries`
8. Wire `ApplicationForm` to insert into `model_applications` + upload photos to storage
9. Add react-hook-form + zod validation to all forms
10. Newsletter signup → wherever the user wants (Mailchimp / table)
11. Final test pass

---

## Execution Strategy

- Each task = a commit. No batching.
- Every `Phase X Checkpoint` = a hard pause: take screenshots, summarize, wait for user review.
- If a task drifts more than 2x its estimated size, stop and flag.
- Re-read `docs/design/visual-system.md` before starting any new screen.
- Re-read `CLAUDE.md` before any styling decision.
- If tempted to add a rounded corner, shadow, or pill button — stop. Re-read the visual system.
