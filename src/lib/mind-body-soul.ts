/* ────────────────────────────────────────────────────────────
 * Mind · Body · Soul — editable program content.
 *
 * Single source of truth for the shape of the MBS section copy and
 * its default value. The default mirrors the original hardcoded
 * `MindBodySoulFeature` JSX verbatim, so the public page is
 * byte-identical before any admin edit and falls back gracefully
 * if the `mind_body_soul` site_settings row is ever missing.
 * ──────────────────────────────────────────────────────────── */

/** One of the three pillars (Mind / Body / Soul). */
export interface MindBodySoulPillar {
  label: string
  blurb: string
}

/** Editable content for the Mind · Body · Soul band on the Events page. */
export interface MindBodySoulContent {
  eyebrow: string
  heading: string
  description: string
  /** Exactly three pillars, rendered left-to-right. */
  pillars: MindBodySoulPillar[]
  cta_label: string
  cta_href: string
}

/** The original hardcoded copy — seed value and graceful fallback. */
export const DEFAULT_MIND_BODY_SOUL: MindBodySoulContent = {
  eyebrow: "A Prasad Bidapa Models Program",
  heading: "Mind · Body · Soul.",
  description:
    "A comprehensive training and grooming program created to shape confident, polished, industry-ready individuals for fashion, media, and public presence. Built on complete personal development, it focuses on confidence building, personality enhancement, fitness, communication skills, etiquette, runway training, and overall presentation.",
  pillars: [
    {
      label: "Mind",
      blurb:
        "Confidence building, personality enhancement and communication skills — the inner work that carries a face through any room.",
    },
    {
      label: "Body",
      blurb:
        "Fitness and runway training that translate presence into movement, posture and a sure command of the stage.",
    },
    {
      label: "Soul",
      blurb:
        "Etiquette, poise and overall presentation — the finish that turns raw potential into a polished, industry-ready professional.",
    },
  ],
  cta_label: "Enquire about training",
  cta_href: "/become-a-model",
}
