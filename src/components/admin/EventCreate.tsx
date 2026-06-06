import { useState } from "react"

import {
  createEvent,
  setEventCover,
  demoteOtherFlagships,
  type EventInsert,
  type EventType,
} from "@/lib/supabase"
import { toast } from "@/hooks/useToast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AdminToggle from "@/components/admin/AdminToggle"
import { compressAndUpload, UploadList, type UploadItem } from "@/components/admin/uploads"

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

const EMPTY: FormState = {
  title: "",
  slug: "",
  type: "property", // a flagship already exists; new events default to property
  event_date: "",
  location: "",
  description: "",
  sort_order: "0",
  published: false, // default draft so an event can be prepped before going live
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const orNull = (v: string) => (v.trim() === "" ? null : v.trim())

function toInsert(f: FormState): EventInsert {
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

export default function EventCreate({
  currentFlagship,
  onDone,
}: {
  /** The current flagship (id + title), so creating a flagship can warn + auto-demote it. */
  currentFlagship?: { id: string; title: string } | null
  onDone: () => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [cover, setCover] = useState<File | null>(null)
  const [items, setItems] = useState<UploadItem[]>([])
  const [busy, setBusy] = useState(false)
  const [pendingDemote, setPendingDemote] = useState(false)

  // Creating a flagship while one already exists.
  const needsDemote = form.type === "flagship" && !!currentFlagship

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  function onTitle(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }))
  }

  const patchItem = (key: string, patch: Partial<UploadItem>) =>
    setItems((list) => list.map((it) => (it.key === key ? { ...it, ...patch } : it)))

  async function handleCreate() {
    if (busy) return
    if (!form.title.trim() || !form.slug.trim()) {
      toast({ variant: "error", message: "Title and slug are required." })
      return
    }
    // Gate creation behind a clear demote confirmation when this new event is a flagship.
    if (needsDemote && !pendingDemote) {
      setPendingDemote(true)
      return
    }
    setBusy(true)

    let id: string
    let slug: string
    try {
      const created = await createEvent(toInsert(form))
      id = created.id
      slug = created.slug
    } catch {
      toast({
        variant: "error",
        message: "Couldn't create the event (is the slug already taken?).",
      })
      setBusy(false)
      return
    }

    // Keep the single-flagship invariant: demote the previous flagship now that this one exists.
    if (form.type === "flagship") {
      try {
        await demoteOtherFlagships(id)
      } catch {
        toast({
          variant: "error",
          message: "Created, but couldn't demote the old flagship. Fix it in the editor.",
        })
      }
    }

    const event = { id, slug }
    let failed = false

    if (cover) {
      setItems([{ key: "cover", name: "Cover image", status: "queued" }])
      const ok = await compressAndUpload(
        cover,
        async (webp) => {
          await setEventCover(event, webp)
        },
        (patch) => patchItem("cover", patch),
      )
      if (!ok) failed = true
    }

    if (failed) {
      toast({
        variant: "error",
        message: "Event created — the cover failed. Add it from the editor.",
      })
    } else {
      toast({ message: `Created ${form.title.trim()}.` })
    }
    setBusy(false)
    onDone()
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 py-10">
      <p className="pbm-eyebrow-mute mb-4">New event</p>
      <h2 className="pbm-display-xs mb-8">Add to calendar</h2>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="c-title" className="pbm-meta-label mb-2">
            Title
          </label>
          <Input
            id="c-title"
            value={form.title}
            onChange={(e) => onTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="c-slug" className="pbm-meta-label mb-2">
            Slug
          </label>
          <Input
            id="c-slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              set("slug", e.target.value)
            }}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="c-type" className="pbm-meta-label mb-2">
            Type
          </label>
          <select
            id="c-type"
            value={form.type}
            onChange={(e) => set("type", e.target.value as EventType)}
            className="pbm-ui w-full appearance-none border-b border-ink bg-transparent py-3 text-[0.75rem] capitalize text-ink outline-none focus-visible:border-gold"
          >
            <option value="property">property</option>
            <option value="flagship">flagship</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="c-date" className="pbm-meta-label mb-2">
            Event date
          </label>
          <Input
            id="c-date"
            type="date"
            value={form.event_date}
            onChange={(e) => set("event_date", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="c-location" className="pbm-meta-label mb-2">
            Location
          </label>
          <Input
            id="c-location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="c-description" className="pbm-meta-label mb-2">
            Description / tagline
          </label>
          <Textarea
            id="c-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="c-sort" className="pbm-meta-label mb-2">
            Sort order
          </label>
          <Input
            id="c-sort"
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

      {/* Cover */}
      <p className="pbm-eyebrow-mute mt-12 mb-4">Cover</p>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 border-b border-hairline pb-3">
          <label className="pbm-link cursor-pointer text-ink">
            Choose cover…
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className="pbm-meta-label normal-case tracking-normal text-mute">
            {cover ? cover.name : "none"}
          </span>
        </div>
        <p className="pbm-meta-label normal-case tracking-normal text-mute">
          The cover is compressed to WebP (~2000px, q80) in your browser before upload.
        </p>
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
              onClick={handleCreate}
              disabled={busy}
              className="border border-ink px-4 py-3 pbm-ui text-[0.75rem] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
            >
              {busy ? "Creating…" : "Demote & create"}
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
        onClick={handleCreate}
        disabled={busy || pendingDemote}
        className="pbm-bar mt-8 disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create event →"}
      </button>

      <UploadList items={items} />
    </div>
  )
}
