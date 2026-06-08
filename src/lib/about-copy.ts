/* ────────────────────────────────────────────────────────────
 * About page editable copy — headlines + body text.
 *
 * Single source of truth for the editable copy on the About page
 * and its default value. Mirrors the original hardcoded section JSX
 * verbatim, so the public page is byte-identical before any admin
 * edit and falls back gracefully if the `about_copy` site_settings
 * row is missing. Images are handled by the site-media slot system
 * and the team grid by `team-members.ts`; only the section copy
 * lives here.
 *
 * Headlines may contain `\n` line breaks — rendered with the
 * `whitespace-pre-line` utility.
 * ──────────────────────────────────────────────────────────── */

export interface AboutCopy {
  hero: {
    headline: string
    manifesto: string
  }
  models: {
    heading: string
    /** One paragraph per entry. */
    body: string[]
  }
  associates: {
    heading: string
    body: string[]
  }
  founder: {
    heading: string
    bio: string[]
    quote: string
  }
  team: {
    heading: string
    description: string
  }
}

/** The original hardcoded copy — seed value and graceful fallback. */
export const DEFAULT_ABOUT_COPY: AboutCopy = {
  hero: {
    headline: "A house of\nfashion, talent\nand craft.",
    manifesto:
      "Forty years of staging the runway, casting the face and producing the show. One studio, two arms, a single editorial eye on the country's craft and its talent.",
  },
  models: {
    heading: "The Models.",
    body: [
      "Prasad Bidapa Models is one of India's most established and trusted model management agencies, dedicated to discovering, developing, and representing exceptional talent. With decades of experience and an unmatched understanding of the industry, the agency has launched successful careers while supplying top-tier models for campaigns, editorials, runway shows, commercials, and brand activations.",
      "Known for professionalism, credibility, and quality representation, it continues to be a preferred destination for both talent and leading brands.",
    ],
  },
  associates: {
    heading: "The Associates.",
    body: [
      "Prasad Bidapa Associates is a globally recognised fashion and lifestyle company that has curated and executed premium fashion events across India and around the world. With a legacy built on creativity, credibility, and innovation, the company has worked with leading luxury brands, institutions, designers, and corporate houses to create memorable experiences at scale.",
      "From fashion weeks and brand launches to image consulting and specialised showcases, it continues to deliver high-impact concepts that combine style, culture, and commercial excellence.",
    ],
  },
  founder: {
    heading: "Prasad Bidapa.",
    bio: [
      "A graduate of NID Ahmedabad and a child of Bengaluru's English theatre circuit, Prasad Bidapa came into fashion sideways — designing costume, then directing runway, then casting the faces who would walk it. The instinct for the editorial image was there from the first show.",
      "Mentored by Martand Singh and Pupul Jayakar — the architects of India's craft revival — he carried their conviction that the country's master artisans were national treasures. That belief threaded itself into every property he has built since, from Rajasthan Heritage Week to the LUXO Luxury platform.",
      "Across four decades he has discovered Deepika Padukone, Anushka Sharma, Lara Dutta, John Abraham, Arjun Rampal, Jacqueline Fernandez and Dino Morea — and produced more than two hundred runway shows for designers and brands across the subcontinent. India Today put him on its 1998 cover; the industry has been listening ever since.",
      "He still books every model on the roster personally, and still writes to the artisans he met in the Eighties.",
    ],
    quote: "\"India's master artisans are our national treasures.\"",
  },
  team: {
    heading: "The Team.",
    description:
      "The people behind the house — runway direction, choreography and talent development, led from the studio in Bengaluru.",
  },
}
