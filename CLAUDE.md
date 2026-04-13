# Prasad Bidapa Models & Associates — Website

## Project
Editorial luxury website for two brands of Prasad Bidapa (NID Ahmedabad, 40+ years in Indian fashion):
- **Prasad Bidapa Models** — the model agency arm
- **Prasad Bidapa Associates** — fashion event production (flagship: Mega Model Hunt)

Visual benchmark: imgmodels.com, fordmodels.com, wilhelmina.com/new-york, viva-models.com — magazine-quality, never SaaS.

## Stack
Vite 8 + React 19 + TypeScript 6 + Tailwind v4 (CSS-first `@theme` config — NO `tailwind.config.js`) + Framer Motion 12 + react-router-dom v7 + Supabase JS + lucide-react + shadcn/ui (v4-compatible).

## Workflow rules
1. **UI first, functionality second.** Never proactively create Supabase schemas, API wiring, form handlers, or queries until the UI exists and the user explicitly green-lights functionality.
2. The user provides UI direction. Don't deviate without asking.
3. Build screen by screen — pause for user review after each major screen.
4. The full design specification lives in `docs/design/visual-system.md`. Re-read it before building any new screen.
5. **Visual references in `Design-Reference/stitch/`** — Google Stitch's attempt at each screen, one folder per screen, each containing `code.html` and `screen.png`. Treat these as **baselines to beat**, not blueprints to copy. Look at the screenshot before building each screen, but do not copy Stitch's HTML — its layout is too conservative on headline scale, its photography is AI-generated and uncanny, and its gold tone is wrong. We win by committing harder to the spec (real Unsplash editorial photos, full 96–200px headlines, exact `#c9a961` gold, real Framer Motion animations).

### Stitch reference → screen mapping
- `visual_system_reference_sheet/` → Phase 1 Style Guide
- `nav_scroll_states_comparison/`, `models_dropdown_desktop/`, `mobile_menu_open_state/` → Phase 2 Layout
- `homepage_desktop/`, `homepage_desktop_video_hero/`, `homepage_bold_editorial_headings/`, `homepage_refined_editorial_legacy/`, `home_editorial_luxury/`, `homepage_mobile/`, `homepage_bold_editorial_mobile/`, `homepage_editorial_mobile_replica/` → Phase 3 Homepage (8 variants — anchor on `homepage_desktop_video_hero` unless user says otherwise)
- `models_listing_desktop/`, `models_listing_mobile/`, `discovery_models/` → Phase 4 Models List
- `model_profile_desktop/`, `model_profile_selena_forrest/` → Phase 5 Model Detail
- `events_desktop/` → Phase 6 Events
- `about_us_desktop/`, `about_us_signature_ips_updated/`, `heritage_editorial/` → Phase 7 About
- `become_a_model_desktop/` → Phase 8 Become a Model
- `contact_desktop/`, `contact_booking/` → Phase 9 Contact

## Visual system (non-negotiable)

### Colors — defined in `src/index.css` via `@theme`
- `--color-ink: #0a0a0a` — primary text, dark sections
- `--color-paper: #fafaf7` — primary background
- `--color-gold: #c9a961` — accent only (eyebrows, pull-quotes, hover lines, dividers when accented)
- `--color-mute: #8a8a85` — secondary/grey text
- Hairline divider: `rgb(10 10 10 / 0.15)` on light, `rgb(250 250 247 / 0.15)` on dark

### Typography
- **Display:** "Playfair Display" — headlines only. Thin/regular weight. 96–160px desktop, 56px mobile max. Generous letter-spacing on small caps.
- **Body / UI:** Inter — 14–16px, weight 400, letter-spacing 0.02em.
- **Small caps labels:** Inter all-caps, tracking 0.2em (`tracking-[0.2em]`), 11–13px.

### Layout language
- Asymmetric 12-col grids on desktop, deliberate whitespace.
- Full-bleed photography.
- **0px border-radius EVERYWHERE.** No rounded corners ever.
- 1px hairline dividers only. No shadows. No gradients (except subtle dark image overlays on hero photos).
- Mobile-first, designed at 375 / 768 / 1440 breakpoints.

### Interactive elements
- **Text-link style** with thin underline that animates left-to-right on hover.
- **Primary CTA** = solid black full-width bar with white tracked all-caps text.
- **Pill / rounded buttons FORBIDDEN.**
- **Form inputs:** underline-only — no boxes, no borders. Exception: photo upload drop zone uses 1px black dashed border.
- **Focus state:** 2px gold underline + label turns gold.
- **Error state:** dark red `#8b1a1a` underline, 12px red caption beneath.

### Anti-patterns (refuse these)
- Rounded corners
- Drop shadows (only ground-reference shadow on event card hover, very faint)
- Gradient buttons
- SaaS hero patterns (centered text + two CTAs)
- Material / Bootstrap / default Tailwind look
- Emoji anywhere in UI

## Animation principles
- Framer Motion for all transitions.
- Editorial pacing: deliberate, slow, never bouncy. Avoid spring overshoot.
- Hover states: 4–8px shifts, gold underline draw-in, subtle desaturation.
- Page transitions: dark curtain sweep from bottom.
- Image reveals: fade + subtle scale (1.02 → 1).
- Marquees: smooth infinite linear, never paused on hover unless specified.
- Default ease: `[0.22, 1, 0.36, 1]` (custom out-expo).

## File conventions
- `src/pages/` — route components (one per screen)
- `src/components/sections/` — homepage folds and reusable page sections
- `src/components/layout/` — Nav, Footer, Layout wrapper, page transitions
- `src/components/ui/` — shadcn primitives
- `src/lib/` — supabase client, utils, animation presets
- `src/hooks/` — custom hooks
- `docs/design/visual-system.md` — full design spec (always reference before building)
- `docs/plans/` — implementation plans

## Asset strategy
- **Placeholders:** Unsplash editorial fashion photos via direct URL (`https://images.unsplash.com/...`). Preferred query: editorial portrait, runway, B&W fashion.
- Real photography will replace placeholders later.
- Self-hosted assets go in `public/images/`.
- **Brand logos:** real PNGs in `public/images/logos/` (`pb-associates.png`, `pb-models.png`), exposed via `brandLogos` in `src/lib/placeholder-assets.ts`.
- Hero video: Pexels / Coverr placeholder, `<video>` with poster fallback.

## Brand mark colors
- The Associates logo contains a baked-in **magenta bar (~`#e6007e`)** that is part of the supplied mark. **It is logo-only.** Do not introduce magenta as a CSS token, accent, or hover color anywhere else on the site. Gold (`#c9a961`) remains the single site accent.
- The supplied PNGs are dark-on-light only. For dark-context surfaces (nav over hero, footer, mobile menu) use either a request for inverted assets or fall back to the text wordmark spec until inverted PNGs are supplied.

## Brand facts (use when writing copy)
- Founder: **Prasad Bidapa**, NID Ahmedabad alumnus, 40+ years in fashion, mentored by Martand Singh and Pupul Jayakar.
- Discovered: Deepika Padukone, Anushka Sharma, Lara Dutta, John Abraham, Arjun Rampal, Jacqueline Fernandez, Dino Morea.
- IPs: Mega Model Hunt (22+ editions), India Men's Fashion Week, Colombo Fashion Week, Rajasthan Heritage Week, LUXO Luxury Weeks, Kingfisher Fashion Awards.
- HQ: Yelahanka, Bengaluru. Studios also referenced as Bengaluru / Mumbai / Delhi.
- Established: 1985.

## Tooling notes
- Tailwind v4 uses `@theme` block in CSS, NOT a JS config file.
- shadcn `init` writes `components.json` and CSS variables; ensure components match the visual system (override defaults — no rounded, no shadows).
- React 19 + Vite 8 are bleeding-edge; some installs may need `--legacy-peer-deps`.
- Dev server: `npm run dev`. Lint: `npm run lint`. Build: `npm run build`.
