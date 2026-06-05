import { useEffect, useState } from "react"

import {
  getAdminModel,
  updateGalleryOrder,
  deleteGalleryImage,
  type AdminModelWithGallery,
  type ModelGalleryRow,
  type ModelGender,
  type ModelRow,
  type ModelUpdate,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { Input } from "@/components/ui/input"
import AdminToggle from "@/components/admin/AdminToggle"
import GalleryManager from "@/components/admin/GalleryManager"

type FormState = {
  name: string
  slug: string
  gender: ModelGender
  height: string
  bust: string
  waist: string
  hips: string
  shoes: string
  hair: string
  eyes: string
  location: string
  board: string
  sort_order: string
  featured: boolean
  published: boolean
}

const TEXT_FIELDS: ReadonlyArray<{ key: keyof FormState; label: string }> = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "height", label: "Height" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoes", label: "Shoes" },
  { key: "hair", label: "Hair" },
  { key: "eyes", label: "Eyes" },
  { key: "location", label: "Location" },
  { key: "board", label: "Board" },
]

const s = (v: string | null) => v ?? ""
const orNull = (v: string) => (v.trim() === "" ? null : v.trim())

function toForm(m: ModelRow): FormState {
  return {
    name: m.name,
    slug: m.slug,
    gender: m.gender,
    height: s(m.height),
    bust: s(m.bust),
    waist: s(m.waist),
    hips: s(m.hips),
    shoes: s(m.shoes),
    hair: s(m.hair),
    eyes: s(m.eyes),
    location: s(m.location),
    board: s(m.board),
    sort_order: String(m.sort_order),
    featured: m.featured,
    published: m.published,
  }
}

function toUpdate(f: FormState): ModelUpdate {
  return {
    name: f.name.trim(),
    slug: f.slug.trim(),
    gender: f.gender,
    height: orNull(f.height),
    bust: orNull(f.bust),
    waist: orNull(f.waist),
    hips: orNull(f.hips),
    shoes: orNull(f.shoes),
    hair: orNull(f.hair),
    eyes: orNull(f.eyes),
    location: orNull(f.location),
    board: orNull(f.board),
    sort_order: Number(f.sort_order) || 0,
    featured: f.featured,
    published: f.published,
  }
}

export default function ModelEditor({
  modelId,
  onSaveFields,
  onDeleteModel,
  onGalleryCountChange,
}: {
  modelId: string
  /** Persist field changes; parent does the optimistic list update + revert/toast. */
  onSaveFields: (id: string, fields: ModelUpdate) => Promise<void>
  /** Delete the whole model; parent removes it from the list + closes the drawer. */
  onDeleteModel: (model: Pick<ModelRow, "id" | "slug" | "cover_image" | "name">) => Promise<void>
  onGalleryCountChange: (id: string, count: number) => void
}) {
  const { data: model, loading, error } = useAsyncData(
    () => getAdminModel(modelId),
    [modelId],
  )

  const [form, setForm] = useState<FormState | null>(null)
  const [gallery, setGallery] = useState<ModelGalleryRow[]>([])
  const [saving, setSaving] = useState(false)
  const [confirmName, setConfirmName] = useState("")
  const [dangerOpen, setDangerOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (model) {
      setForm(toForm(model))
      setGallery(model.gallery)
    }
  }, [model])

  if (loading) {
    return (
      <div className="px-8 py-10">
        <p className="pbm-eyebrow-mute animate-pulse">Loading…</p>
      </div>
    )
  }
  if (error || !model || !form) {
    return (
      <div className="px-8 py-10">
        <p className="text-error text-[0.8125rem]">Couldn't load this model.</p>
      </div>
    )
  }

  // Narrowed once here so the handler closures below see a non-null model.
  const m: AdminModelWithGallery = model

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f))

  async function handleSave() {
    if (!form || saving) return
    setSaving(true)
    try {
      await onSaveFields(m.id, toUpdate(form))
      toast({ message: "Saved." })
    } catch {
      // Parent reverts list state; surface the failure here.
      toast({ variant: "error", message: "Couldn't save. Try again." })
    } finally {
      setSaving(false)
    }
  }

  async function handleReorder(orderedIds: string[]) {
    const prev = gallery
    const next = orderedIds
      .map((id) => gallery.find((g) => g.id === id))
      .filter((g): g is ModelGalleryRow => !!g)
      .map((g, i) => ({ ...g, sort_order: i }))
    setGallery(next)
    try {
      await updateGalleryOrder(m.id, orderedIds)
    } catch {
      setGallery(prev)
      toast({ variant: "error", message: "Couldn't save the new order." })
    }
  }

  async function handleDeleteImage(image: ModelGalleryRow) {
    const prev = gallery
    const next = gallery.filter((g) => g.id !== image.id)
    setGallery(next)
    try {
      await deleteGalleryImage(image.id, image.image_path)
      onGalleryCountChange(m.id, next.length)
    } catch {
      setGallery(prev)
      toast({ variant: "error", message: "Couldn't delete the image." })
    }
  }

  async function handleDeleteModel() {
    if (deleting) return
    setDeleting(true)
    try {
      await onDeleteModel({
        id: m.id,
        slug: m.slug,
        cover_image: m.cover_image,
        name: m.name,
      })
      // Parent closes the drawer on success.
    } catch {
      toast({ variant: "error", message: "Couldn't delete the model." })
      setDeleting(false)
    }
  }

  const canDelete = confirmName.trim() === m.name

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 py-10">
      <p className="pbm-eyebrow-mute mb-4">Edit model</p>
      <h2 className="pbm-display-xs mb-8">{m.name}</h2>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {TEXT_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={`f-${key}`} className="pbm-meta-label mb-2">
              {label}
            </label>
            <Input
              id={`f-${key}`}
              value={form[key] as string}
              onChange={(e) => set(key, e.target.value as FormState[typeof key])}
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label htmlFor="f-gender" className="pbm-meta-label mb-2">
            Gender
          </label>
          <select
            id="f-gender"
            value={form.gender}
            onChange={(e) => set("gender", e.target.value as ModelGender)}
            className="pbm-ui w-full appearance-none border-b border-ink bg-transparent py-3 text-[0.75rem] capitalize text-ink outline-none focus-visible:border-gold"
          >
            <option value="female">female</option>
            <option value="male">male</option>
          </select>
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
          label="Featured"
          checked={form.featured}
          onChange={(v) => set("featured", v)}
        />
        <AdminToggle
          label="Published"
          checked={form.published}
          onChange={(v) => set("published", v)}
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="pbm-bar mt-8 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes →"}
      </button>

      {/* Gallery */}
      <p className="pbm-eyebrow-mute mt-12 mb-2">Gallery</p>
      <p className="pbm-meta-label mb-4 normal-case tracking-normal text-mute">
        Drag to reorder · the top image is the primary (slide 1) on the site.
      </p>
      <GalleryManager
        gallery={gallery}
        onReorderCommit={handleReorder}
        onDeleteImage={handleDeleteImage}
      />

      {/* Danger zone */}
      <div className="mt-14 border-t border-error/40 pt-6">
        <p className="pbm-eyebrow-mute mb-4 text-error">Danger zone</p>
        {!dangerOpen ? (
          <button
            type="button"
            onClick={() => setDangerOpen(true)}
            className="pbm-link text-error"
          >
            Delete this model
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="pbm-body text-mute">
              This permanently deletes <strong className="text-ink">{m.name}</strong>,
              the whole gallery, and every stored image. This cannot be undone. Type the
              model's name to confirm.
            </p>
            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={m.name}
              aria-label="Type the model name to confirm deletion"
            />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleDeleteModel}
                disabled={!canDelete || deleting}
                className="border border-error px-4 py-3 pbm-ui text-[0.75rem] text-error transition-colors hover:bg-error hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-error"
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDangerOpen(false)
                  setConfirmName("")
                }}
                className="pbm-meta-label text-mute"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
