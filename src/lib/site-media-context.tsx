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
