import { useEffect, useState } from "react"

import { getSiteContent, setSiteSetting, type Json } from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"

/* ────────────────────────────────────────────────────────────
 * Shared editor for a single editable `site_settings` content row
 * (home_copy, about_copy, …). Generalizes the Mind · Body · Soul
 * load→form→optimistic-save-with-revert pattern: on failure the
 * persisted snapshot reverts but the form keeps the edits.
 * ──────────────────────────────────────────────────────────── */
export function useContentEditor<T>(key: string, fallback: T) {
  const { data, loading, error } = useAsyncData(
    () => getSiteContent(key, fallback),
    [],
  )
  // `form` is the working copy; `saved` is the last persisted snapshot for revert.
  const [form, setForm] = useState<T | null>(null)
  const [saved, setSaved] = useState<T | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) {
      setForm(data)
      setSaved(data)
    }
  }, [data])

  async function save() {
    if (!form || saving) return
    const snapshot = saved
    setSaving(true)
    setSaved(form) // optimistic
    try {
      await setSiteSetting(key, form as unknown as Json)
      toast({ message: "Saved." })
    } catch {
      setSaved(snapshot)
      toast({ variant: "error", message: "Couldn't save. Try again." })
    } finally {
      setSaving(false)
    }
  }

  return { form, setForm, loading, error, saving, save }
}
