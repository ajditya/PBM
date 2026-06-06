import { useEffect, useState } from "react"

import { getMindBodySoul, updateMindBodySoul } from "@/lib/supabase"
import {
  DEFAULT_MIND_BODY_SOUL,
  type MindBodySoulContent,
} from "@/lib/mind-body-soul"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/* ────────────────────────────────────────────────────────────
 * Admin panel for the Mind · Body · Soul program copy — distinct
 * program content, NOT an event row. Reads/writes the single
 * `mind_body_soul` site_settings row. No image upload. Save is
 * optimistic-with-revert: on failure the form restores the last
 * successfully-persisted snapshot.
 * ──────────────────────────────────────────────────────────── */

export default function MindBodySoulPanel() {
  const { data, loading, error } = useAsyncData(() => getMindBodySoul(), [])
  // `form` is the working copy; `saved` is the last persisted snapshot for revert.
  const [form, setForm] = useState<MindBodySoulContent | null>(null)
  const [saved, setSaved] = useState<MindBodySoulContent | null>(null)
  const [savingState, setSaving] = useState(false)

  useEffect(() => {
    if (data) {
      setForm(data)
      setSaved(data)
    }
  }, [data])

  function setField<K extends keyof MindBodySoulContent>(
    key: K,
    value: MindBodySoulContent[K],
  ) {
    setForm((f) => (f ? { ...f, [key]: value } : f))
  }

  function setPillar(index: number, key: "label" | "blurb", value: string) {
    setForm((f) => {
      if (!f) return f
      const pillars = f.pillars.map((p, i) =>
        i === index ? { ...p, [key]: value } : p,
      )
      return { ...f, pillars }
    })
  }

  async function handleSave() {
    if (!form || savingState) return
    const snapshot = saved
    setSaving(true)
    setSaved(form) // optimistic: treat the edit as persisted
    try {
      await updateMindBodySoul(form)
      toast({ message: "Saved." })
    } catch {
      // Revert the persisted snapshot; leave the form as-is so edits aren't lost.
      setSaved(snapshot)
      toast({ variant: "error", message: "Couldn't save. Try again." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-20 border-t border-hairline pt-12">
      <p className="pbm-eyebrow mb-4">Program content</p>
      <h2 className="pbm-display-xs mb-2">Mind · Body · Soul</h2>
      <p className="pbm-meta-label mb-10 normal-case tracking-normal text-mute">
        The grooming-program band on the public Events page. Not an event — edits here update the
        dark Mind · Body · Soul section directly.
      </p>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load the program content. Refresh to retry.
        </p>
      )}

      {!loading && !error && form && (
        <div className="max-w-2xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label htmlFor="mbs-eyebrow" className="pbm-meta-label mb-2">
                Eyebrow
              </label>
              <Input
                id="mbs-eyebrow"
                value={form.eyebrow}
                onChange={(e) => setField("eyebrow", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="mbs-heading" className="pbm-meta-label mb-2">
                Heading
              </label>
              <Input
                id="mbs-heading"
                value={form.heading}
                onChange={(e) => setField("heading", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="mbs-description" className="pbm-meta-label mb-2">
                Description
              </label>
              <Textarea
                id="mbs-description"
                className="min-h-[8rem]"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
          </div>

          {/* Pillars */}
          <p className="pbm-eyebrow-mute mt-12 mb-4">Pillars</p>
          <div className="flex flex-col gap-8">
            {form.pillars.map((p, i) => (
              <div key={i} className="flex flex-col gap-4 border-b border-hairline pb-6">
                <div className="flex flex-col">
                  <label htmlFor={`mbs-pillar-${i}-label`} className="pbm-meta-label mb-2">
                    Pillar {i + 1} · Label
                  </label>
                  <Input
                    id={`mbs-pillar-${i}-label`}
                    value={p.label}
                    onChange={(e) => setPillar(i, "label", e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`mbs-pillar-${i}-blurb`} className="pbm-meta-label mb-2">
                    Pillar {i + 1} · Blurb
                  </label>
                  <Textarea
                    id={`mbs-pillar-${i}-blurb`}
                    value={p.blurb}
                    onChange={(e) => setPillar(i, "blurb", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <p className="pbm-eyebrow-mute mt-12 mb-4">Call to action</p>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label htmlFor="mbs-cta-label" className="pbm-meta-label mb-2">
                CTA label
              </label>
              <Input
                id="mbs-cta-label"
                value={form.cta_label}
                onChange={(e) => setField("cta_label", e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="mbs-cta-href" className="pbm-meta-label mb-2">
                CTA link
              </label>
              <Input
                id="mbs-cta-href"
                value={form.cta_href}
                onChange={(e) => setField("cta_href", e.target.value)}
                placeholder={DEFAULT_MIND_BODY_SOUL.cta_href}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={savingState}
            className="pbm-bar mt-10 w-auto px-6 disabled:opacity-50"
          >
            {savingState ? "Saving…" : "Save program content →"}
          </button>
        </div>
      )}
    </div>
  )
}
