# Prasad Bidapa Website — Full Visual System & Screen Specifications

> Authoritative design spec. Re-read the relevant section before building any screen.
> Source: user brief delivered 2026-04-13. Originally drafted for Google Stitch.

## Aesthetic
Editorial luxury fashion-agency. References: imgmodels.com, fordmodels.com, wilhelmina.com/new-york, viva-models.com. Magazine-quality, not SaaS.

## Palette
- Background off-white `#fafaf7`
- Primary text deep black `#0a0a0a`
- Accent gold `#c9a961`
- Muted grey `#8a8a85` for secondary text
- Dark sections: `#0a0a0a` background with `#fafaf7` text

## Typography
- Playfair Display for all headlines — thin/regular weight, very large (96–160px on desktop hero), generous letter-spacing on small caps
- Inter for body and UI — 14–16px, weight 400, letter-spacing 0.02em
- Small caps for nav and labels with tracking 0.2em

## Layout language
- Asymmetric 12-col grids, deliberate whitespace, full-bleed photography
- No rounded corners (sharp 0px radius)
- Thin 1px hairline dividers in `#0a0a0a/15`
- No shadows. No gradients except subtle dark overlays on hero images

## Buttons
- Text-link style with thin underline that animates on hover
- Pill/rounded buttons forbidden

## Responsiveness
Mobile-first but design both 375px and 1440px frames.

---

# Screen 1 — Homepage

## Top nav
Sticky, transparent over hero, solid `#0a0a0a` after scroll. Three-zone layout.
- **Top-left:** small wordmark logo "PRASAD BIDAPA / ASSOCIATES" stacked in two lines, all-caps Playfair
- **Top-right:** matching wordmark "PRASAD BIDAPA / MODELS"
- **Center:** horizontal nav links in Inter all-caps 12px tracked: HOME · MODELS ▾ · EVENTS · BECOME A MODEL · ABOUT · CONTACT

## Hero (100vh)
Full-bleed background showing a fashion runway scene (model walking, dramatic lighting). Dark gradient overlay from bottom (60% black) to top (20% black).
- **Bottom-left content:** tiny gold eyebrow "EST. 1985 · BENGALURU" in tracked small caps, then massive Playfair headline in white "Faces that / define fashion." set on two lines, 140px desktop / 56px mobile, line-height 0.95. Below: a thin "DISCOVER →" link in white with underline.
- **Bottom-right:** vertical text "SCROLL" with a thin animated line.

## Fold 2 — About Prasad Bidapa
Off-white background, 160px vertical padding. Asymmetric two-column.
- **Left 5 cols:** tall vertical portrait of Prasad Bidapa (B&W, editorial)
- **Right 6 cols, offset down by 80px:** small gold label "THE MENTOR", Playfair headline "Four decades / shaping Indian / fashion." (72px), then two short Inter paragraphs about NID Ahmedabad, 40+ years, and discovering Deepika Padukone, Anushka Sharma, Lara Dutta, John Abraham, Arjun Rampal, Jacqueline Fernandez. Large pull-quote in gold Playfair italic: "India's master artisans are our national treasures." Thin "READ THE STORY →" link.

## Fold 3 — Prasad Bidapa Models
Full-bleed dark `#0a0a0a` section, 100vh.
- **Right:** three-image asymmetric collage (one tall, two stacked)
- **Left:** tiny "01 / THE AGENCY" in gold, Playfair headline in off-white "The faces / behind the / brands." (96px), short paragraph, then "MEET THE MODELS →" CTA

## Fold 4 — Prasad Bidapa Associates
Mirrored layout, off-white background. Image collage on the LEFT, text on the right. Label "02 / THE EVENTS", headline "Where talent / is discovered." Mention flagship Mega Model Hunt. CTA "EXPLORE EVENTS →".

## Fold 5 — Clients marquee
Single horizontal row of 8–10 grayscale client logos (placeholder fashion brands), thin hairline divider above and below, label "TRUSTED BY" centered above in tracked small caps. White background, 120px tall.

## Fold 6 — Events
Off-white. Section header left-aligned "UPCOMING & RECENT" (Playfair 56px). Below: horizontal-scroll row of 4 large event cards, each card = full-bleed image (3:4 ratio), with date "15 · 03 · 2026" in large Playfair below image, event title, location, and thin "VIEW →" link. No card borders, no shadows.

## Footer
`#0a0a0a` background, two-column.
- **Left:** large Playfair "Prasad Bidapa" logo + Bengaluru address
- **Right:** nav links in two columns + Instagram/LinkedIn icons + a single-line newsletter input with thin underline and "→" submit
- **Bottom hairline:** "© 2026 Prasad Bidapa. All rights reserved." and "CRAFTED IN BENGALURU"

---

# Screen 2 — Models Listing (Female / Male)

Same sticky nav as homepage, locked into its solid dark `#0a0a0a` state from the start (no transparent-over-hero phase — that variant is reserved for the homepage hero only).

## Page header (60vh)
Off-white. Left-aligned massive Playfair "Women." (or "Men.") at 200px, with a tiny "01 — THE ROSTER · 47 TALENTS" eyebrow above. Below the headline, a thin filter bar: "ALL · NEW FACES · MAINBOARD · DEVELOPMENT · DIGITAL" as text links with the active one underlined in gold.

## Models grid
Asymmetric masonry — NOT a uniform grid. Mix portrait images at three sizes (large 2-col-wide, medium 1-col, tall 1-col-tall) across a 4-column desktop grid (2-col mobile). Tight 8px gutters. Each card = full-bleed photograph (no padding, no border, no rounded corners). Below each image, only two lines: model first name in Playfair 24px, then "VIEW →" in tiny tracked Inter all-caps.

**Hover:** image desaturates slightly, a thin gold line draws under the name, and the word "PORTFOLIO" appears.

## Bottom
Pagination as "01 / 04" minimal text with thin arrows, centered. Footer same as homepage.

---

# Screen 3 — Model Detail Page

## Hero section
Split 60/40.
- **Left 60%:** single full-bleed editorial portrait, runs full viewport height
- **Right 40%:** off-white panel with generous padding. Tiny eyebrow "WOMEN · MAINBOARD", massive Playfair name "Aisha / Khanna" stacked on two lines (88px), thin gold divider, then a stats table — two columns, Inter 14px, label in grey, value in black:
  - HEIGHT 178 cm · BUST 84 · WAIST 60 · HIPS 89 · HAIR Black · EYES Brown · SHOES 39 · LOCATION Bengaluru
- Below: solid black bar full-width "INQUIRE ABOUT THIS MODEL →" with white text, Inter all-caps tracked. Below it: thin "DOWNLOAD DIGITALS ↓" link.

## Gallery section
Full-width, off-white background, 120px top padding. No section title — just the work. Asymmetric editorial layout: one full-bleed image, then a two-up split, then a single centered portrait at 60% width, then a three-up row, repeating. Mix of portraits, full-body, B&W, color. Tight 4px gutters. 12+ images.

## Inquiry dialog
Centered modal on a 70% black backdrop, 480px wide, off-white background. Header: Playfair "Inquire about Aisha Khanna" (28px) and a small × close. Form fields stacked with thin underline-only inputs (no boxes): Your Name, Company, Email, Phone, Project Details (textarea), Estimated Dates. Submit button: solid black full-width "SEND INQUIRY →".

---

# Screen 4 — Events Page

## Page header
Off-white, 50vh. Left-aligned massive Playfair "Events." (200px) with eyebrow "PRASAD BIDAPA ASSOCIATES · SINCE 1985".

## Tab bar
Horizontal text tabs below the header, sticky on scroll: "FLAGSHIP · UPCOMING · PAST · RECURRING". Active tab in black with a thin gold underline; inactive in grey. Inter all-caps 13px tracked.

## Flagship section (default view) — featured Mega Model Hunt
Full-bleed editorial layout. Large landscape hero image of a runway show, then below it on off-white:
- **Left column:** Playfair "Mega / Model / Hunt." stacked (120px) with gold eyebrow "THE FLAGSHIP · 22 EDITIONS"
- **Right column:** paragraph copy mentioning it discovered Deepika Padukone, Anushka Sharma, Lara Dutta, plus a stats row "22 EDITIONS · 8,000+ AUDITIONS · 150+ SIGNED TALENTS · 6 CITIES" with large Playfair numbers and tiny labels beneath
- CTA: "APPLY FOR 2026 EDITION →"

## Other events grid
Below the flagship, a 3-column grid (1-col mobile) of event cards. Each card: full-bleed 4:5 image, below it a row with date in Playfair on left and city on right, then event title in Playfair 28px, then one-line description, then thin "DETAILS →" link. Include placeholder events: India Men's Fashion Week, Colombo Fashion Week, Kingfisher Fashion Awards, Rajasthan Heritage Week, LUXO Luxury Weeks.

---

# Screen 5 — About Us

## Hero (80vh)
Off-white. Centered single line eyebrow "EST. 1985 · BENGALURU · INDIA", below it Playfair headline left-aligned "A house of / fashion, talent / and craft." (120px) spanning the full viewport. Below on the right: a 2-line Inter paragraph as a manifesto.

## Section 1 — Prasad Bidapa Associates
Asymmetric two-column.
- **Left:** stacked editorial photo grid (3 images)
- **Right:** label "01", headline "The Associates." (72px Playfair), three paragraphs about large-scale talent hunt shows, fashion week production, government and brand partnerships. Subtle list of services as small-caps text links with bullet dots.

## Section 2 — Prasad Bidapa Models
Mirrored layout. Headline "The Models." Copy about the agency arm — supplying models to brands across India and internationally.

## Section 3 — Founder
Full-bleed dark `#0a0a0a` section with off-white text. Large vertical portrait on the right.
- **Left content:** gold eyebrow "THE FOUNDER", Playfair headline "Prasad Bidapa." (96px), biography paragraphs covering NID Ahmedabad, theatre origins, mentorship by Martand Singh and Pupul Jayakar, sustainable fashion advocacy, India Today 1998 cover, four-decade career

## Section 4 — IPs / Properties grid
Off-white. Section header "Our Properties." Then a 4-column grid (2-col mobile) of property cards: Mega Model Hunt, India Men's Fashion Week, Colombo Fashion Week, Rajasthan Heritage Week, LUXO Luxury Weeks, Kingfisher Fashion Awards. Each card: full-bleed image, name in Playfair, one-line tagline, year established.

## Section 5 — Team
Off-white. Header "The Team." Asymmetric grid of 6–10 team members. Each = portrait photo (no rounded corners), name in Playfair 20px, role in tracked small caps grey.

---

# Screen 6 — Become a Model

Editorial, not a typical signup form.

## Hero (70vh)
Off-white.
- **Left 6/12:** massive Playfair "Be / Discovered." (160px) stacked, eyebrow "OPEN CALL · 2026"
- **Right 5/12 (offset down):** paragraph about Mega Model Hunt history, what they look for, mentioning supermodels who started this way
- Single CTA scroll-cue "BEGIN APPLICATION ↓"

## Multi-step form section
Off-white, max-width 720px centered. Top progress: "01 — PERSONAL · 02 — MEASUREMENTS · 03 — PHOTOS · 04 — REVIEW" with active step in black, others in grey, connected by thin hairlines.

### Step 1 — Personal
Stacked underline-only inputs (no boxes, no rounded corners), 18px Inter, with tiny tracked labels above in small caps grey: Full Name, Email, Phone, Date of Birth, Gender (radio: Female / Male / Non-binary as text with radio dot), City, Instagram Handle. Bottom: thin "← BACK" left-aligned (disabled), solid black "CONTINUE →" right-aligned.

### Step 2 — Measurements
Height, Bust/Chest, Waist, Hips, Shoes, Hair, Eyes — all underline inputs in a 2-column grid.

### Step 3 — Photos
Large dashed-border drop zone (only step where a border is allowed, 1px black dashed) with text "DROP YOUR PHOTOS / OR CLICK TO UPLOAD" in Playfair 32px and instructions below: "Minimum 4 photos · Headshot, full-body front, full-body side, profile · Natural light · No filters · JPG or PNG · Max 10MB each". Show 4 uploaded thumbnails as a sample.

### Step 4 — Review
Clean summary of all entered info as a two-column table, then a single "SUBMIT APPLICATION →" black bar full-width.

### Success state
Centered Playfair "Thank you. / We'll be in touch." with a thin gold line and tiny "RETURN HOME" link.

---

# Screen 7 — Contact

## Hero (50vh)
Off-white. Left-aligned Playfair "Get in touch." (120px), eyebrow "BENGALURU · MUMBAI · DELHI".

## Main split (50/50)
- **Left half:** off-white panel with generous padding. Three contact blocks stacked, each with tracked small-caps label and Playfair details:
  - STUDIO — full address in Yelahanka, Bengaluru, with Playfair 24px street line
  - GENERAL — hello@prasadbidapa.com · +91 80 XXXX XXXX
  - BOOKINGS — bookings@prasadbidapa.com
  - PRESS — press@prasadbidapa.com
  - Below: Instagram and LinkedIn as text links with arrows
- **Right half:** full-bleed minimalist map (light grey monochrome map style, single black pin on the studio, no Google branding visible)

## Contact form section
Below the split. Off-white, max-width 640px centered. Header "Or send a message." Underline-only inputs: Name, Email, Subject (dropdown styled as text + chevron: General / Booking / Press / Become a Model), Message (textarea, 4 rows). Solid black full-width "SEND MESSAGE →".

---

# A. Navigation States

## A1 — Models Dropdown (Desktop)
Sticky top nav in solid `#0a0a0a` (scrolled state) with off-white text. The "MODELS" link is hovered/active with a thin gold underline.
Dropdown panel slides down from the nav bar, full viewport width, `#0a0a0a` background, 80px vertical padding, hairline `#fafaf7/15` divider at top. Inside, a 12-column grid:
- **Cols 1–5:** Two large image previews side by side (one female model portrait, one male model portrait), each 4:5 ratio, with a tiny gold label below: "WOMEN — 28 TALENTS" and "MEN — 19 TALENTS" in tracked small caps
- **Cols 7–9:** Three text links stacked, large Playfair 48px in off-white: "Women →", "Men →", "New Faces →". Hover: thin gold underline draws in left-to-right
- **Cols 10–12:** Tiny tracked small-caps label "FEATURED THIS MONTH", then 3 model name text links in Inter 14px with thin arrow
- **Bottom:** thin hairline, then "VIEW THE FULL ROSTER →" in off-white tracked small caps, right-aligned

## A2 — Mobile Hamburger Menu (Open State)
375px wide, full viewport height. Background `#0a0a0a`, off-white text. Slides in from the right.
- **Top bar:** Same nav height as collapsed state. Left: small Playfair "PB" monogram in gold. Right: an × close icon (thin, hairline weight, 24px)
- **Body content** (40px horizontal padding, 60px top padding): vertical stack of nav links separated by hairline dividers `#fafaf7/15`:
  - HOME / MODELS (with + indicating expandable) / EVENTS / BECOME A MODEL / ABOUT / CONTACT
  - Each in Playfair 36px off-white, with tracked tiny number prefix in gold ("01", "02"...)
  - 32px vertical spacing
- **Models expanded sub-state:** indented sub-items in Inter 18px tracked small caps: "— WOMEN", "— MEN", "— NEW FACES"
- **Bottom (pinned):** tiny "FOLLOW" label, Instagram + LinkedIn text links with arrows, then "BENGALURU · MUMBAI · DELHI" tracked

## A3 — Nav Scroll States Comparison
Two side-by-side states, 1440px wide, 120px tall each.
- **Transparent (over hero):** background fully transparent, all text/logos in off-white. Two stacked-line wordmark logos at left and right edges. Center nav links in Inter all-caps 12px tracked white
- **Scrolled (after 100px):** background solid `#0a0a0a`, hairline `#fafaf7/10` bottom border. Logos and links shift to off-white. Bar compresses 120px → 80px

---

# B. Models Page Additional States

## B1 — Model Card Hover State
320 × 480px frame.
- **Default:** full-bleed editorial portrait, model name "Aisha" in Playfair 24px below image left-aligned, "VIEW →" tiny tracked Inter all-caps below
- **Hover:** image desaturated to 80% grayscale, subtle dark overlay 15%. Centered: small caps "VIEW PORTFOLIO" off-white with thin gold underline drawn in. Below image: name "Aisha" with thin gold line drawn underneath. Arrow shifted 4px right.

## B2 — Empty / Loading States
- **Loading:** same masonry layout, each card a flat `#0a0a0a/5` rectangle. No spinners, no shimmer. Two thin grey hairlines below each block for name + link. Page header stays normal.
- **Empty (no results):** centered, tiny "NO TALENTS MATCH YOUR FILTERS", Playfair "Try a different / category." (56px), thin "← VIEW ALL TALENTS" link.

## B3 — Filter Active State
Horizontal strip, full-width, 80px tall, off-white. Inline filter links: "ALL · NEW FACES · MAINBOARD · DEVELOPMENT · DIGITAL". MAINBOARD is active in `#0a0a0a` with a thin gold underline. Inactive in `#8a8a85`. To the right: small "12 RESULTS" tracked grey, with "× CLEAR" reset link.

---

# C. Inquiry Dialog — All States

## C1 — Default
Already covered in Screen 3.

## C2 — Submitting
All inputs dimmed to 50% opacity and disabled. Submit button text "SENDING..." in same solid black bar with three small dots animating on the right (middle slightly larger). No spinner.

## C3 — Success
Replaces form content. Centered: thin gold horizontal line 40px wide at top. Playfair 36px "Inquiry sent." Inter 14px grey "Our team will respond within 24 hours regarding Aisha Khanna's availability." Tracked small-caps "CONTINUE BROWSING →" link in `#0a0a0a` with thin underline. × close top-right. 80px vertical padding. Calm and final, not celebratory — no checkmarks, no green, no confetti.

## C4 — Error
Form still visible. Above the form: thin dark red `#8b1a1a` 1px hairline strip with Inter 13px: "Something went wrong. Please try again or email bookings@prasadbidapa.com directly." × dismiss right. Submit re-enabled.

---

# D. Become a Model — All Form States

## D1 — Steps 1, 2, 3, 4
Each as its own frame.

## D2 — Photo Upload States
- **Empty:** dashed `#0a0a0a` 1px border drop zone, 320px tall. Centered Playfair 32px "Drop your photos / or click to upload." Below: instructions in Inter 13px grey
- **Uploading:** drop zone shows 4 thumbnail tiles in a row at top (each 4:5 ratio, 140px wide, 4px gutters). One thumbnail has thin gold horizontal progress bar at bottom showing 60%. Below: dashed drop zone smaller (160px tall) with "Add more photos."
- **Complete with validation error:** 4 thumbnails in a row with tiny × delete on top-right. Thin gold "PRIMARY" label on first thumbnail. One has thin red border with caption "Image too large — max 10MB." CONTINUE button disabled (50% opacity)

## D3 — Application Success Screen
Full viewport, off-white. Centered vertical: tiny tracked gold "APPLICATION RECEIVED · 14 APRIL 2026 · #PB-2026-0247". Huge Playfair "Thank you, / Aisha." (96px). Inter paragraph about reviewing within 14 days. Thin "RETURN HOME →" link. Single thin gold vertical line down right side of viewport.

## D4 — Form Validation Error
Inline, isolated 480px wide.
- Tracked label "EMAIL" in `#0a0a0a` above
- Underline input with "aisha@gmail" (incomplete)
- Bottom underline now thin red `#8b1a1a`
- Below: tiny Inter 12px in red "Please enter a valid email address."

Focused state: same field empty, bottom underline 2px gold `#c9a961`, label "EMAIL" also in gold.

---

# E. Events Page Additional States

## E1 — Event Detail Modal/Page
Full page.
- **Hero:** full-bleed landscape image, 80vh, dark gradient at bottom. Bottom-left: tiny gold "FLAGSHIP · 23rd EDITION", massive Playfair "Mega Model / Hunt 2026." (120px) off-white, thin row "BENGALURU · MUMBAI · DELHI · KOLKATA · HYDERABAD · CHENNAI" tracked, then date "MARCH — JUNE 2026" Playfair 32px gold
- **Body:** off-white, asymmetric. Left 4 cols sticky meta sidebar with tracked labels and Playfair values: DATES, LOCATIONS, AUDITIONS START, FINALE, AGE GROUP, FORMAT. Below: solid black "REGISTER FOR AUDITIONS →" CTA bar
- **Right 7 cols:** "About the Hunt." paragraph copy. "Past Discoveries." 3-column grid of B&W portraits (Deepika Padukone, Anushka Sharma, Lara Dutta) with names below. "City Schedule." two-column table with hairline dividers
- **Press strip:** hairline-bordered horizontal strip with 5 grayscale press logos (Vogue, Elle, GQ, Harper's Bazaar, Femina) and "AS SEEN IN" label
- **Related events grid** at bottom — 3 cards

## E2 — Event Card Hover
320 × 480px.
- **Default:** full-bleed image (4:5), date "15 · 03 · 2026" Playfair 28px, title Playfair 22px, location row tracked grey, "VIEW →"
- **Hover:** image lifts 8px upward (very faint shadow), date shifts to gold, "VIEW →" gets gold underline drawn in, tiny "01 / 04" pagination indicator appears in top-right of image

## E3 — Empty Events
- **No upcoming:** centered tiny "NOTHING ON THE CALENDAR YET", Playfair "New events / coming soon." (56px), "VIEW PAST EVENTS →"
- **No past:** Playfair "Our archive / starts here." (56px)

---

# F. Footer Detailed States

## F1 — Newsletter Signup States
400px wide on `#0a0a0a`.
- **Empty:** "STAY IN TOUCH" tracked label. Single-line input with off-white bottom hairline, placeholder `#fafaf7/40` "your@email.com", thin "→" submit
- **Submitting:** "→" replaced by three animating dots
- **Success:** input replaced with "Thank you. You're on the list." Inter 14px off-white, thin gold underline drawn

## F2 — Footer Mobile Layout
375px wide, `#0a0a0a`. Stacked vertical, 32px horizontal padding, 80px top padding:
1. Large Playfair "Prasad / Bidapa." logo (48px stacked)
2. Hairline divider
3. Address block — Inter 13px tracked label "STUDIO" in gold, then 3 lines in off-white
4. Hairline divider
5. Newsletter signup full width
6. Hairline divider
7. Nav links as single vertical column, tracked small caps 13px each
8. Hairline divider
9. Instagram + LinkedIn text links with arrows
10. Hairline divider
11. Bottom row: "© 2026" left, "BENGALURU" right, both tiny tracked grey

---

# G. Contact Page Additional States

## G1 — Contact Form Success
640px max-width centered. Thin gold 40px horizontal line, Playfair 36px "Message received.", Inter 14px grey "We respond to all inquiries within 48 hours.", thin "SEND ANOTHER MESSAGE →" link.

## G2 — Subject Dropdown Open
640px wide. SUBJECT field shown with dropdown panel expanded below. Panel: off-white, thin `#0a0a0a` 1px border, no rounded. Four 56px-tall options stacked with hairline dividers: GENERAL INQUIRY, BOOKING REQUEST, PRESS & MEDIA, BECOME A MODEL. Hovered option ("BOOKING REQUEST") has `#fafaf7` → `#0a0a0a/5` background tint and tiny gold "→" arrow on right.

---

# H. Global Components

## H1 — Loading / Page Transition
- **Loader:** off-white viewport. Centered Playfair "PB" monogram in `#0a0a0a` 64px, with thin gold horizontal line beneath animating (60% drawn left to right). Below: tracked tiny "LOADING"
- **Page-out transition:** solid `#0a0a0a` panel sweeping in from bottom covering bottom 70%, top 30% still shows previous content

## H2 — Image Lightbox
Full viewport, `#0a0a0a` 95% opacity. Centered editorial portrait at max 80% viewport height, no border. × top-right. Bottom-center: pagination "03 / 14" tracked off-white. Left/right edges: thin "←" "→" off-white 60% opacity. Bottom-left: caption "AISHA KHANNA — VOGUE INDIA, 2025" tracked off-white.

## H3 — Cookie Consent Banner
Pinned bottom, full width, 80px tall, `#0a0a0a` background, hairline gold top border. Left: Inter 13px off-white "We use cookies to enhance your experience. Read our [Privacy Policy]." with gold underline link. Right: two text links separated by thin vertical divider — "DECLINE" `#fafaf7/60` and "ACCEPT" off-white tracked.

## H4 — 404 Page
Full viewport, off-white. Asymmetric: left half = full-bleed empty runway image. Right half = centered: tiny gold "ERROR · 404", massive Playfair "Page not / found." (120px), Inter "The page you're looking for has moved off the runway.", thin "← RETURN HOME" link. Bottom right: tiny rotated 90° "PRASAD BIDAPA" wordmark.

## H5 — Search Overlay
Full viewport off-white slides down from top. × top-right, "PB" monogram top-left. Center: single line input, only thick `#0a0a0a` 2px bottom hairline, 80% viewport width, placeholder tracked grey "SEARCH MODELS, EVENTS, OR PRESS...". Input text Playfair 56px. Below: tracked "QUICK LINKS" then horizontal row of 5 text links. Below: results section preview.

## H6 — Toast Notification
400 × 80px, pinned bottom-center. `#0a0a0a` background, off-white text, no rounded, thin gold left border 2px wide. Inside: tiny tracked "SAVED" gold label, Inter 14px off-white "Aisha Khanna added to your shortlist." × dismiss right. Variant with red left border for errors.

---

# I. Responsive Breakpoint Frames
For each main screen (1–7), produce three breakpoints: Mobile 375px, Tablet 768px, Desktop 1440px. Maintain same content and visual language across all three — only layout structure (column counts, type sizes, image arrangements) adapts. On mobile: hero headlines drop to 56px max, asymmetric grids collapse to single-column stacks, dropdowns become full-screen sheets.

---

# J. Visual System Reference Sheet
Single 1440 × 2400px frame. Off-white background. Title at top: Playfair "Prasad Bidapa — Visual System." (56px). Sections with thin hairline dividers:
1. **Color palette:** 4 large color swatch squares (200×200px) in a row with hex codes
2. **Typography scale:** Playfair Display at 160 / 96 / 72 / 48 / 32 / 24px with sample "Faces that define fashion." Inter at 18 / 16 / 14 / 13 / 12px
3. **Logo lockups:** Both wordmarks side by side, "PB" monogram, horizontal lockup
4. **Button & link library:** Solid black bar CTA, text-link with gold underline, disabled, hover — 6 variants
5. **Form input library:** Default, focused (gold underline), error (red underline), filled, disabled
6. **Spacing scale:** Visual representation 4, 8, 16, 24, 32, 48, 64, 96, 128, 160px as horizontal bars
7. **Grid system:** 12-column grid overlay at 1440px with 24px gutters, plus 4-column mobile at 375px with 16px gutters
8. **Iconography:** Lucide icon set at 20px in `#0a0a0a` — arrows, ×, +, −, Instagram, LinkedIn, hamburger, search

No colored boxes around sections — only hairline dividers and tracked small-caps section labels.

---

# Recommended generation order
1. **J** — Style Reference Sheet
2. **A3** — Nav scroll states
3. **Main screens 1–7** — homepage first, then iterate
4. **A1, A2** — nav dropdowns / mobile menu
5. **B, C, D, E, F, G** — page-specific states
6. **H** — global components last
7. **I** — responsive variants for each finalized screen
