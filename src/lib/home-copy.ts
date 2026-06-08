/* ────────────────────────────────────────────────────────────
 * Homepage editable copy — headlines + body text.
 *
 * Single source of truth for the editable copy on the homepage and
 * its default value. Mirrors the original hardcoded section JSX
 * verbatim, so the public page is byte-identical before any admin
 * edit and falls back gracefully if the `home_copy` site_settings
 * row is missing. Images/video are handled separately by the
 * site-media slot system; only text lives here.
 *
 * Headlines may contain `\n` line breaks — rendered with the
 * `whitespace-pre-line` utility so the editorial line stacking is
 * preserved and editable from a textarea.
 * ──────────────────────────────────────────────────────────── */

export interface HomeCopy {
  hero: {
    /** Large hero headline (newlines render as line breaks). */
    headline: string
  }
  about: {
    heading: string
    subhead: string
    /** One paragraph per entry. */
    body: string[]
    quote: string
  }
  modelsTeaser: {
    heading: string
    body: string
  }
  associatesTeaser: {
    heading: string
    body: string
  }
  eventsScroll: {
    heading: string
  }
}

/** The original hardcoded copy — seed value and graceful fallback. */
export const DEFAULT_HOME_COPY: HomeCopy = {
  hero: {
    headline: "Faces that\ndefine fashion.",
  },
  about: {
    heading: "Prasad\nBidapa",
    subhead: "Four decades shaping Indian fashion.",
    body: [
      "A pioneering force in Indian fashion, Prasad Bidapa has spent decades shaping the country's style landscape through runway direction, talent discovery, and fashion entrepreneurship. Widely regarded as one of the architects of modern fashion presentation in India, he has elevated fashion shows into world-class experiences blending creativity, discipline, and commercial relevance.",
      "His influence spans fashion weeks, luxury showcases, pageants, talent platforms, and model development.",
    ],
    quote: "\"India's master artisans are our national treasures.\"",
  },
  modelsTeaser: {
    heading: "Prasad\nBidapa\nModels",
    body: "One of India's most established and trusted model management agencies, dedicated to discovering, developing, and representing exceptional talent. With decades of experience, the agency has launched successful careers while supplying top-tier models for campaigns, editorials, runway shows, commercials, and brand activations. Known for professionalism, credibility, and quality representation.",
  },
  associatesTeaser: {
    heading: "Prasad\nBidapa\nAssociates",
    body: "A globally recognised fashion and lifestyle company that curates and executes premium fashion events across India and worldwide. Built on creativity, credibility, and innovation, it has worked with leading luxury brands, institutions, designers, and corporate houses — from fashion weeks and brand launches to image consulting and specialised showcases.",
  },
  eventsScroll: {
    heading: "Events.",
  },
}
