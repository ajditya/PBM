import { useCallback, useEffect, useState } from "react"

import { useAsyncData } from "@/hooks/useAsyncData"
import { getSiteSettings, type Json } from "@/lib/supabase"
import {
  SITE_MEDIA_GROUPS,
  SITE_MEDIA_SLOTS,
  type SiteSettingsMap,
} from "@/lib/site-media"
import MediaSlotRow from "@/components/admin/MediaSlotRow"

/**
 * Media library — swap site-wide imagery/video. Each slot reads/writes a
 * `site_settings` row; leaving a slot empty falls back to the bundled default.
 * Settings are fetched once and patched in place after each write, so previews
 * stay current without a refetch.
 */
export default function MediaManager() {
  const { data, loading, error } = useAsyncData(getSiteSettings, [])
  const [map, setMap] = useState<SiteSettingsMap>({})

  useEffect(() => {
    if (data) setMap(data)
  }, [data])

  const patch = useCallback((key: string, value: Json) => {
    setMap((m) => ({ ...m, [key]: value }))
  }, [])

  return (
    <div className="px-10 py-12">
      <div className="mb-12">
        <p className="pbm-eyebrow mb-4">Media</p>
        <h1 className="pbm-display-s">Media library</h1>
        <p className="pbm-body mt-3 max-w-xl text-mute">
          Swap site-wide imagery and video. Leave a slot empty to use the
          built-in default.
        </p>
      </div>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load media settings. Refresh to retry.
        </p>
      )}

      {!loading &&
        !error &&
        SITE_MEDIA_GROUPS.map((group) => (
          <section key={group} className="mb-14">
            <h2 className="pbm-eyebrow-mute mb-6 border-b border-hairline pb-3">
              {group}
            </h2>
            <div className="flex flex-col gap-10">
              {SITE_MEDIA_SLOTS.filter((s) => s.group === group).map((slot) => (
                <MediaSlotRow
                  key={slot.key}
                  slot={slot}
                  value={map[slot.key]}
                  onChange={patch}
                />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
