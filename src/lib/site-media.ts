/* ────────────────────────────────────────────────────────────
 * Site media registry — the single source of truth for swappable
 * site-wide imagery/video.
 *
 * Each slot maps a `site_settings` row (key → jsonb) to a storage
 * location in the public `site` bucket and to the STATIC constant in
 * placeholder-assets.ts it overrides. The contract is shared by both
 * the admin Media manager (writes) and the public read hooks
 * (site-media-context.tsx): a consumer reads the slot value and falls
 * back to the static constant when empty, so the site is byte-identical
 * to today until an admin uploads — zero visual regression.
 *
 * Stored value shapes:
 *   single  → {"url": "site/hero/video.mp4"}   (image | video)
 *   multi   → {"urls": ["site/about/1.webp", …]}  (ordered image set)
 * ──────────────────────────────────────────────────────────── */

import {
  aboutAssociatesPhotos,
  aboutModelsPhotos,
  founderPortrait,
  heroVideo,
} from "@/lib/placeholder-assets"
import { publicUrl } from "@/lib/supabase/storage"
import type { Json } from "@/lib/supabase/types"

/** The public bucket every site-media object lives in. */
export const SITE_BUCKET = "site"

export type MediaKind = "image" | "video"

export interface SingleMediaValue {
  url: string
}
export interface MultiMediaValue {
  urls: string[]
}

export interface SiteMediaSlot {
  /** site_settings primary key, e.g. "hero_video". */
  key: string
  kind: MediaKind
  /** true => MultiMediaValue (ordered, fixed-length array). */
  multi?: boolean
  /** For multi slots: the exact number of positions (e.g. About trios = 3). */
  count?: number
  /** UI grouping header in the admin Media page. */
  group: string
  label: string
  /** One-line helper shown under the label in the admin UI. */
  hint?: string
  /**
   * Path under the `site` bucket, WITHOUT bucket prefix or extension.
   *   single → `${storagePath}.webp` / `.mp4`
   *   multi  → `${storagePath}/${index + 1}.webp`
   */
  storagePath: string
  /** The placeholder-assets constant this slot overrides (the fallback). */
  fallback: string | readonly string[]
  /** Video slots reference their poster slot so the admin can preview a still. */
  posterKey?: string
}

export const SITE_MEDIA_SLOTS: SiteMediaSlot[] = [
  {
    key: "hero_video",
    kind: "video",
    group: "Hero",
    label: "Hero background video",
    hint: "Full-bleed autoplay video on the homepage. MP4; keep it tight (≈10–25 MB).",
    storagePath: "hero/video",
    fallback: heroVideo.src,
    posterKey: "hero_poster",
  },
  {
    key: "hero_poster",
    kind: "image",
    group: "Hero",
    label: "Hero poster image",
    hint: "Shown before the video loads and as a still on slow connections.",
    storagePath: "hero/poster",
    fallback: heroVideo.poster,
  },
  {
    key: "founder_portrait",
    kind: "image",
    group: "About",
    label: "Founder portrait",
    hint: "Prasad Bidapa's portrait on the About page (rendered grayscale). Tall 3:4 crop.",
    storagePath: "about/founder",
    fallback: founderPortrait,
  },
  {
    key: "about_associates_photos",
    kind: "image",
    multi: true,
    count: 3,
    group: "About",
    label: "Associates photo trio",
    hint: "Three stacked editorial photos beside the Associates copy. Any slot left empty uses its default.",
    storagePath: "about/associates",
    fallback: aboutAssociatesPhotos,
  },
  {
    key: "about_models_photos",
    kind: "image",
    multi: true,
    count: 3,
    group: "About",
    label: "Models photo trio",
    hint: "Three stacked editorial photos beside the Models copy. Any slot left empty uses its default.",
    storagePath: "about/models",
    fallback: aboutModelsPhotos,
  },
]

/** Group ordering for the admin Media page. */
export const SITE_MEDIA_GROUPS = ["Hero", "About"] as const

export type SiteSettingsMap = Record<string, Json | undefined>

export function slotByKey(key: string): SiteMediaSlot | undefined {
  return SITE_MEDIA_SLOTS.find((s) => s.key === key)
}

function readUrl(raw: Json | undefined): string {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const url = (raw as { url?: unknown }).url
    if (typeof url === "string") return url
  }
  return ""
}

function readUrls(raw: Json | undefined): string[] {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const urls = (raw as { urls?: unknown }).urls
    if (Array.isArray(urls)) {
      return urls.filter((u): u is string => typeof u === "string")
    }
  }
  return []
}

/** Resolve a single image/video slot to a public URL, or its static fallback when empty. */
export function resolveSingle(map: SiteSettingsMap, slot: SiteMediaSlot): string {
  return publicUrl(readUrl(map[slot.key])) || (slot.fallback as string)
}

/**
 * Resolve a multi-image slot to EXACTLY `slot.count` URLs. Each position falls
 * back to the static constant at the same index, so a partially-filled slot
 * (only photo 1 uploaded) still renders the rest from the static set and never
 * blanks a layout cell.
 */
export function resolveMulti(map: SiteSettingsMap, slot: SiteMediaSlot): string[] {
  const stored = readUrls(map[slot.key])
  const fallback = slot.fallback as readonly string[]
  const n = slot.count ?? fallback.length
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    out.push(publicUrl(stored[i]) || fallback[i] || "")
  }
  return out
}
