import { useEffect, useState } from "react"

import {
  getAdminModels,
  updateModel,
  deleteModel,
  publicUrl,
  type AdminModelRow,
  type ModelRow,
  type ModelUpdate,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import ModelEditor from "@/components/admin/ModelEditor"

export default function ModelsManager() {
  const { data, loading, error } = useAsyncData(() => getAdminModels(), [])
  const [models, setModels] = useState<AdminModelRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (data) setModels(data)
  }, [data])

  // Optimistic field save: merge into the list immediately; revert if the write
  // fails (the editor surfaces the toast on the thrown error).
  async function handleSaveFields(id: string, fields: ModelUpdate) {
    const prev = models
    setModels((list) =>
      list.map((m) => (m.id === id ? { ...m, ...fields } : m)),
    )
    try {
      await updateModel(id, fields)
    } catch (e) {
      setModels(prev)
      throw e
    }
  }

  async function handleDeleteModel(
    model: Pick<ModelRow, "id" | "slug" | "cover_image" | "name">,
  ) {
    await deleteModel(model)
    setModels((list) => list.filter((m) => m.id !== model.id))
    setSelectedId(null)
    toast({ message: `Deleted ${model.name}.` })
  }

  function handleGalleryCountChange(id: string, count: number) {
    setModels((list) =>
      list.map((m) => (m.id === id ? { ...m, gallery_count: count } : m)),
    )
  }

  return (
    <div className="px-10 py-12">
      <p className="pbm-eyebrow mb-4">Models</p>
      <h1 className="pbm-display-s mb-10">Roster</h1>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load the roster. Refresh to retry.
        </p>
      )}

      {!loading && !error && (
        <ul className="flex flex-col">
          {models.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelectedId(m.id)}
                className={cn(
                  "group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-hairline py-4 text-left transition-colors hover:bg-ink/[0.02]",
                  !m.published && "opacity-45",
                )}
              >
                <span className="h-16 w-12 shrink-0 overflow-hidden bg-ink/5">
                  {m.cover_image && (
                    <img
                      src={publicUrl(m.cover_image)}
                      alt=""
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>

                <span className="min-w-0">
                  <span className="pbm-meta-value block truncate">{m.name}</span>
                  <span className="pbm-meta-label mt-1 block truncate normal-case tracking-normal text-mute">
                    {m.gender} · {m.board ?? "—"} · {m.gallery_count} image
                    {m.gallery_count === 1 ? "" : "s"}
                  </span>
                </span>

                <span className="flex items-center gap-2">
                  {m.featured && (
                    <span className="border border-gold px-2 py-1 text-[0.625rem] uppercase tracking-[0.2em] text-ink">
                      Featured
                    </span>
                  )}
                  <span
                    className={cn(
                      "border px-2 py-1 text-[0.625rem] uppercase tracking-[0.2em]",
                      m.published
                        ? "border-hairline text-mute"
                        : "border-error/50 text-error",
                    )}
                  >
                    {m.published ? "Published" : "Draft"}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet
        open={selectedId !== null}
        onOpenChange={(o) => !o && setSelectedId(null)}
      >
        <SheetContent side="right" className="w-full bg-paper text-ink sm:max-w-xl">
          <SheetTitle className="sr-only">Edit model</SheetTitle>
          {selectedId && (
            <ModelEditor
              key={selectedId}
              modelId={selectedId}
              onSaveFields={handleSaveFields}
              onDeleteModel={handleDeleteModel}
              onGalleryCountChange={handleGalleryCountChange}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
