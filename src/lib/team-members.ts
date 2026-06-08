/* ────────────────────────────────────────────────────────────
 * Team members — editable list for the About page team grid.
 *
 * Stored as a single `team_members` site_settings row:
 *   { members: TeamMemberContent[] }
 * Order = array order. The default mirrors the original hardcoded
 * `teamMembers` (placeholder-assets) so the public grid is identical
 * until an admin edits, and falls back gracefully if the row is missing.
 *
 * `img` holds EITHER a static asset path/URL (the defaults, e.g.
 * "/images/founder/prasad-01.jpg") OR a `site` bucket path written by
 * an admin upload ("site/team/{id}.webp"). `teamImageSrc` distinguishes
 * the two so only bucket paths go through publicUrl (with cache-buster).
 * ──────────────────────────────────────────────────────────── */

import { teamMembers } from "@/lib/placeholder-assets"
import { publicUrl } from "@/lib/supabase/storage"

export interface TeamMemberContent {
  /** Stable id — drives storage path `team/{id}.webp` and React keys. */
  id: string
  name: string
  /** Role / credential line shown under the name. */
  role: string
  /** Editorial bio paragraph. */
  bio: string
  /** Static asset path/URL (default) or "site/team/{id}.webp" (uploaded). */
  img: string
  /** Cache-buster bumped on each image upload (for bucket paths only). */
  v?: number
}

export interface TeamContent {
  members: TeamMemberContent[]
}

/** Resolve a member's photo URL — bucket paths get publicUrl + cache-buster; static paths pass through. */
export function teamImageSrc(member: TeamMemberContent): string {
  if (!member.img) return ""
  return member.img.startsWith("site/")
    ? publicUrl(member.img, member.v)
    : member.img
}

/** Stable ids for the seeded members (positional, matches the original array). */
const DEFAULT_IDS = ["prasad-bidapa", "arry-dabas", "shamsher-rana"]

/** The original hardcoded team — seed value and graceful fallback. */
export const DEFAULT_TEAM_MEMBERS: TeamContent = {
  members: teamMembers.map((m, i) => ({
    id: DEFAULT_IDS[i] ?? `member-${i + 1}`,
    name: m.name,
    role: m.role,
    bio: m.bio,
    img: m.img,
  })),
}
