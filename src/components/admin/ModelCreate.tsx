import { useState } from "react"

import {
  createModel,
  setModelCover,
  addModelGalleryImage,
  type ModelGender,
  type ModelInsert,
} from "@/lib/supabase"
import { toast } from "@/hooks/useToast"
import { Input } from "@/components/ui/input"
import AdminToggle from "@/components/admin/AdminToggle"
import { compressAndUpload, UploadList, type UploadItem } from "@/components/admin/uploads"

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
  measurements_unit: "cm" | "in"
  sort_order: string
  featured: boolean
  published: boolean
}

const EMPTY: FormState = {
  name: "",
  slug: "",
  gender: "female",
  height: "",
  bust: "",
  waist: "",
  hips: "",
  shoes: "",
  hair: "",
  eyes: "",
  location: "",
  measurements_unit: "cm",
  sort_order: "0",
  featured: false,
  published: false, // default draft so a model can be prepped before going live
}

const TEXT_FIELDS: ReadonlyArray<{ key: keyof FormState; label: string }> = [
  { key: "height", label: "Height" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoes", label: "Shoes" },
  { key: "hair", label: "Hair" },
  { key: "eyes", label: "Eyes" },
  { key: "location", label: "Location" },
]

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const orNull = (v: string) => (v.trim() === "" ? null : v.trim())

function toInsert(f: FormState): ModelInsert {
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
    measurements_unit: f.measurements_unit,
    sort_order: Number(f.sort_order) || 0,
    featured: f.featured,
    published: f.published,
  }
}

export default function ModelCreate({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [cover, setCover] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [items, setItems] = useState<UploadItem[]>([])
  const [busy, setBusy] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  function onName(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }))
  }

  const patchItem = (key: string, patch: Partial<UploadItem>) =>
    setItems((list) => list.map((it) => (it.key === key ? { ...it, ...patch } : it)))

  async function handleCreate() {
    if (busy) return
    if (!form.name.trim() || !form.slug.trim()) {
      toast({ variant: "error", message: "Name and slug are required." })
      return
    }
    setBusy(true)

    let id: string
    let slug: string
    try {
      const created = await createModel(toInsert(form))
      id = created.id
      slug = created.slug
    } catch {
      toast({
        variant: "error",
        message: "Couldn't create the model (is the slug already taken?).",
      })
      setBusy(false)
      return
    }

    const model = { id, slug }
    let failures = 0

    // Seed the progress list (cover first, then gallery in order).
    const queued: UploadItem[] = []
    if (cover) queued.push({ key: "cover", name: "Cover image", status: "queued" })
    galleryFiles.forEach((f, i) =>
      queued.push({ key: `g${i}`, name: f.name, status: "queued" }),
    )
    setItems(queued)

    if (cover) {
      const ok = await compressAndUpload(
        cover,
        async (webp) => {
          await setModelCover(model, webp)
        },
        (patch) => patchItem("cover", patch),
      )
      if (!ok) failures++
    }

    // Gallery: upload order = sort order (index 0 is primary / slide 1).
    for (let i = 0; i < galleryFiles.length; i++) {
      const ok = await compressAndUpload(
        galleryFiles[i],
        async (webp) => {
          await addModelGalleryImage(model, webp, i + 1, i)
        },
        (patch) => patchItem(`g${i}`, patch),
      )
      if (!ok) failures++
    }

    if (failures > 0) {
      toast({
        variant: "error",
        message: `Model created — ${failures} image(s) failed. Add them from the editor.`,
      })
    } else {
      toast({ message: `Created ${form.name.trim()}.` })
    }
    setBusy(false)
    onDone()
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 py-10">
      <p className="pbm-eyebrow-mute mb-4">New model</p>
      <h2 className="pbm-display-xs mb-8">Add to roster</h2>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="c-name" className="pbm-meta-label mb-2">
            Name
          </label>
          <Input
            id="c-name"
            value={form.name}
            onChange={(e) => onName(e.target.value)}
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
          <label htmlFor="c-gender" className="pbm-meta-label mb-2">
            Gender
          </label>
          <select
            id="c-gender"
            value={form.gender}
            onChange={(e) => set("gender", e.target.value as ModelGender)}
            className="pbm-ui w-full appearance-none border-b border-ink bg-transparent py-3 text-[0.75rem] capitalize text-ink outline-none focus-visible:border-gold"
          >
            <option value="female">female</option>
            <option value="male">male</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="c-unit" className="pbm-meta-label mb-2">
            Measurements unit
          </label>
          <select
            id="c-unit"
            value={form.measurements_unit}
            onChange={(e) => set("measurements_unit", e.target.value as FormState["measurements_unit"])}
            className="pbm-ui w-full appearance-none border-b border-ink bg-transparent py-3 text-[0.75rem] capitalize text-ink outline-none focus-visible:border-gold"
          >
            <option value="cm">cm</option>
            <option value="in">inches</option>
          </select>
        </div>

        {TEXT_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={`c-${key}`} className="pbm-meta-label mb-2">
              {label}
            </label>
            <Input
              id={`c-${key}`}
              value={form[key] as string}
              onChange={(e) => set(key, e.target.value as FormState[typeof key])}
            />
          </div>
        ))}

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

        <AdminToggle label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
        <AdminToggle label="Published" checked={form.published} onChange={(v) => set("published", v)} />
      </div>

      {/* Images */}
      <p className="pbm-eyebrow-mute mt-12 mb-4">Images</p>
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
        <div className="flex items-center justify-between gap-4 border-b border-hairline pb-3">
          <label className="pbm-link cursor-pointer text-ink">
            Choose gallery images…
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))}
            />
          </label>
          <span className="pbm-meta-label normal-case tracking-normal text-mute">
            {galleryFiles.length ? `${galleryFiles.length} selected` : "none"}
          </span>
        </div>
        <p className="pbm-meta-label normal-case tracking-normal text-mute">
          Images are compressed to WebP (~2000px, q80) in your browser before upload.
          First gallery image is the primary (slide 1).
        </p>
      </div>

      <button
        type="button"
        onClick={handleCreate}
        disabled={busy}
        className="pbm-bar mt-8 disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create model →"}
      </button>

      <UploadList items={items} />
    </div>
  )
}
