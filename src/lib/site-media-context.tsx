/* ────────────────────────────────────────────────────────────
 * Site-media provider — fetches all site_settings once and exposes
 * resolved media slot values to public components.
 *
 * Anti-flash contract: before settings load (and whenever a slot is
 * empty) the hooks return the STATIC fallback synchronously. Consumers
 * that must not swap their source at runtime (e.g. the hero <video>)
 * gate on useSiteMediaReady() and mount once with the final value, so
 * there is no static→DB remount on the live site once a real asset is
 * set — a visitor loads the resolved asset exactly once.
 *
 * `ready` is true once the fetch has SETTLED — success OR error — so an
 * unreachable Supabase still lets gated consumers fall through to their
 * static fallback rather than waiting forever.
 *
 * Mounted inside the public Layout only — the admin shell never depends
 * on this provider (MediaManager fetches getSiteSettings itself).
 * ──────────────────────────────────────────────────────────── */

import { createContext, useContext, type ReactNode } from "react"

import { useAsyncData } from "@/hooks/useAsyncData"
import { getSiteSettings } from "@/lib/supabase"
import {
  resolveMulti,
  resolveSingle,
  slotByKey,
  type SiteSettingsMap,
} from "@/lib/site-media"

interface SiteMediaContextValue {
  map: SiteSettingsMap
  /** True once the settings fetch has settled (resolved or errored). */
  ready: boolean
}

const EMPTY: SiteSettingsMap = {}

const SiteMediaContext = createContext<SiteMediaContextValue>({
  map: EMPTY,
  ready: false,
})

export function SiteMediaProvider({ children }: { children: ReactNode }) {
  const { data, error } = useAsyncData(getSiteSettings, [])
  const value: SiteMediaContextValue = {
    map: data ?? EMPTY,
    ready: data !== undefined || error !== undefined,
  }
  return (
    <SiteMediaContext.Provider value={value}>
      {children}
    </SiteMediaContext.Provider>
  )
}

/**
 * True once site settings have settled — gate runtime-immutable media (the hero
 * <video>) on this so it mounts once with its final source instead of swapping
 * static→DB after load.
 */
export function useSiteMediaReady(): boolean {
  return useContext(SiteMediaContext).ready
}

/** Resolve a single image/video slot to a URL, falling back to its static constant. */
export function useSiteMedia(key: string): string {
  const { map } = useContext(SiteMediaContext)
  const slot = slotByKey(key)
  return slot ? resolveSingle(map, slot) : ""
}

/** Resolve a multi-image slot to exactly its configured count of URLs (per-index fallback). */
export function useSiteMediaList(key: string): string[] {
  const { map } = useContext(SiteMediaContext)
  const slot = slotByKey(key)
  return slot ? resolveMulti(map, slot) : []
}

/**
 * Merge stored content over the typed default: objects merge key-by-key (so a
 * field added to the default later stays populated for old rows), arrays are
 * replaced wholesale (so removing a paragraph/member shrinks the list), and
 * primitives take the stored value when present.
 */
function mergeContent<T>(fallback: T, stored: unknown): T {
  if (stored === null || stored === undefined) return fallback
  if (Array.isArray(fallback) || Array.isArray(stored)) return stored as T
  if (
    typeof fallback === "object" &&
    fallback !== null &&
    typeof stored === "object"
  ) {
    const out: Record<string, unknown> = { ...(fallback as Record<string, unknown>) }
    const src = stored as Record<string, unknown>
    for (const k of Object.keys(src)) {
      out[k] = mergeContent((fallback as Record<string, unknown>)[k], src[k])
    }
    return out as T
  }
  return stored as T
}

/**
 * Resolve an editable content row (e.g. "home_copy", "about_copy",
 * "team_members") from the same single settings fetch the media hooks use.
 * Returns the typed default until settings load and merges the stored value
 * over it — so the public copy renders synchronously with no extra round-trip.
 */
export function useSiteContent<T>(key: string, fallback: T): T {
  const { map } = useContext(SiteMediaContext)
  return mergeContent(fallback, map[key])
}
