import { useEffect, useState } from "react"

import {
  getAdminEvent,
  setEventCover,
  publicUrl,
  type EventRow,
  type EventType,
  type EventUpdate,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AdminToggle from "@/components/admin/AdminToggle"
import { compressAndUpload, type UploadItem } from "@/components/admin/uploads"

type FormState = {
  title: string
  slug: string
  type: EventType
  event_date: string
  location: string
  description: string
  sort_order: string
  published: boolean
}

const s = (v: string | null) => v ?? ""
const orNull = (v: string) => (v.trim() === "" ? null : v.trim())

function toForm(e: EventRow): FormState {
  return {
    title: e.title,
    slug: e.slug,
    type: e.type,
    event_date: s(e.event_date),
    location: s(e.location),
    description: s(e.description),
    sort_order: String(e.sort_order),
    published: e.published,
  }
}

function toUpdate(f: FormState): EventUpdate {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    type: f.type,
    event_date: orNull(f.event_date),
    location: orNull(f.location),
    description: orNull(f.description),
    sort_order: Number(f.sort_order) || 0,
    published: f.published,
  }
}

export default function EventEditor({
  eventId,
  currentFlagship,
  onSaveFields,
  onDeleteEvent,
}: {
  eventId: string
  /** The current flagship (id + title), so promoting this one can warn + auto-demote it. */
  currentFlagship?: { id: string; title: string } | null
  /** Persist field changes; parent does the optimistic list update + revert/toast. */
  onSaveFields: (id: string, fields: EventUpdate) => Promise<void>
  /** Delete the whole event; parent removes it + closes the drawer. Omitted = delete disabled. */
  onDeleteEvent?: (event: Pick<EventRow, "id" | "slug" | "cover_image" | "title">) => Promise<void>
}) {
  const { data: event, loading, error } = useAsyncData(
    () => getAdminEvent(eventId),
    [eventId],
  )

  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [pendingDemote, setPendingDemote] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState("")
  const [dangerOpen, setDangerOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [coverPath, setCoverPath] = useState<string | null>(null)
  const [coverBust, setCoverBust] = useState(0)
  const [coverItem, setCoverItem] = useState<UploadItem | null>(null)

  useEffect(() => {
    if (event) {
      setForm(toForm(event))
      setCoverPath(event.cover_image)
    }
  }, [event])

  if (loading) {
    return (
      <div className="px-8 py-10">
        <p className="pbm-eyebrow-mute animate-pulse">Loading…</p>
      </div>
    )
  }
  if (error || !event || !form) {
    return (
      <div className="px-8 py-10">
        <p className="text-error text-[0.8125rem]">Couldn't load this event.</p>
      </div>
    )
  }

  // Narrowed once here so the handler closures below see a non-null event.
  const ev: EventRow = event

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f))

  // Promoting THIS event to flagship while a different event already holds it.
  const needsDemote =
    form.type === "flagship" &&
    !!currentFlagship &&
    currentFlagship.id !== ev.id

  async function doSave() {
    if (!form || saving) return
    setSaving(true)
    try {
      await onSaveFields(ev.id, toUpdate(form))
      toast({ message: "Saved." })
      setPendingDemote(false)
    } catch {
      // Parent reverts list state; surface the failure here.
      toast({ variant: "error", message: "Couldn't save. Try again." })
    } finally {
      setSaving(false)
    }
  }

  function handleSave() {
    // Gate the save behind a clear demote confirmation when promoting to flagship.
    if (needsDemote && !pendingDemote) {
      setPendingDemote(true)
      return
    }
    doSave()
  }

  async function handleReplaceCover(file: File) {
    setCoverItem({ key: "cover", name: file.name, status: "queued" })
    const ok = await compressAndUpload(
      file,
      async (webp) => {
        const path = await setEventCover({ id: ev.id, slug: ev.slug }, webp)
        setCoverPath(path)
        setCoverBust(Date.now()) // bust the CDN cache for the same-path cover
      },
      (patch) => setCoverItem((it) => (it ? { ...it, ...patch } : it)),
    )
    if (!ok) toast({ variant: "error", message: "Couldn't upload the cover." })
  }

  async function handleDeleteEvent() {
    if (!onDeleteEvent || deleting) return
    setDeleting(true)
    try {
      await onDeleteEvent({
        id: ev.id,
        slug: ev.slug,
        cover_image: ev.cover_image,
        title: ev.title,
      })
      // Parent closes the drawer on success.
    } catch {
      toast({ variant: "error", message: "Couldn't delete the event." })
      setDeleting(false)
    }
  }

  const canDelete = confirmTitle.trim() === ev.title

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 py-10">
      <p className="pbm-eyebrow-mute mb-4">Edit event</p>
      <h2 className="pbm-display-xs mb-8">{ev.title}</h2>

      {/* Cover */}
      <div className="mb-8 flex items-center gap-4 border-b border-hairline pb-6">
        <span className="h-20 w-16 shrink-0 overflow-hidden bg-ink/5">
          {coverPath && (
            <img
              src={publicUrl(coverPath) + (coverBust ? `?t=${coverBust}` : "")}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
          )}
        </span>
        <div className="flex flex-col gap-1">
          <span className="pbm-meta-label">Cover</span>
          <label className="pbm-link cursor-pointer text-ink">
            {coverPath ? "Replace cover…" : "Add cover…"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleReplaceCover(f)
                e.target.value = ""
              }}
            />
          </label>
          {coverItem && coverItem.status !== "done" && (
            <span className="pbm-meta-label capitalize text-mute">
              {coverItem.status}…
            </span>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="f-title" className="pbm-meta-label mb-2">
            Title
          </label>
          <Input
            id="f-title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="f-slug" className="pbm-meta-label mb-2">
            Slug
          </label>
          <Input
            id="f-slug"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="f-type" className="pbm-meta-label mb-2">
            Type
          </label>
          <select
            id="f-type"
            value={form.type}
            onChange={(e) => set("type", e.target.value as EventType)}
            className="pbm-ui w-full appearance-none border-b border-ink bg-transparent py-3 text-[0.75rem] capitalize text-ink outline-none focus-visible:border-gold"
          >
            <option value="property">property</option>
            <option value="flagship">flagship</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="f-date" className="pbm-meta-label mb-2">
            Event date
          </label>
          <Input
            id="f-date"
            type="date"
            value={form.event_date}
            onChange={(e) => set("event_date", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="f-location" className="pbm-meta-label mb-2">
            Location
          </label>
          <Input
            id="f-location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="f-description" className="pbm-meta-label mb-2">
            Description / tagline
          </label>
          <Textarea
            id="f-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="f-sort" className="pbm-meta-label mb-2">
            Sort order
          </label>
          <Input
            id="f-sort"
            type="number"
            value={form.sort_order}
            onChange={(e) => set("sort_order", e.target.value)}
          />
        </div>

        <AdminToggle
          label="Published"
          checked={form.published}
          onChange={(v) => set("published", v)}
        />
      </div>

      {pendingDemote && currentFlagship && (
        <div className="mt-8 border border-gold/60 bg-gold/[0.06] p-5">
          <p className="pbm-body text-ink">
            <strong>{currentFlagship.title}</strong> is currently the flagship — making this the
            flagship will move it to a property. Continue?
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={doSave}
              disabled={saving}
              className="border border-ink px-4 py-3 pbm-ui text-[0.75rem] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
            >
              {saving ? "Saving…" : "Demote & save"}
            </button>
            <button
              type="button"
              onClick={() => setPendingDemote(false)}
              className="pbm-meta-label text-mute"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || pendingDemote}
        className="pbm-bar mt-8 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes →"}
      </button>

      {/* Danger zone — only available once delete is wired (post check-in). */}
      {onDeleteEvent && (
        <div className="mt-14 border-t border-error/40 pt-6">
          <p className="pbm-eyebrow-mute mb-4 text-error">Danger zone</p>
          {!dangerOpen ? (
            <button
              type="button"
              onClick={() => setDangerOpen(true)}
              className="pbm-link text-error"
            >
              Delete this event
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="pbm-body text-mute">
                This permanently deletes{" "}
                <strong className="text-ink">{ev.title}</strong> and its stored cover. This
                cannot be undone. Type the event's title to confirm.
              </p>
              <Input
                value={confirmTitle}
                onChange={(e) => setConfirmTitle(e.target.value)}
                placeholder={ev.title}
                aria-label="Type the event title to confirm deletion"
              />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  disabled={!canDelete || deleting}
                  className="border border-error px-4 py-3 pbm-ui text-[0.75rem] text-error transition-colors hover:bg-error hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-error"
                >
                  {deleting ? "Deleting…" : "Delete permanently"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDangerOpen(false)
                    setConfirmTitle("")
                  }}
                  className="pbm-meta-label text-mute"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
