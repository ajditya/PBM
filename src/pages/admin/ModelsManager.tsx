import { useCallback, useEffect, useState } from "react"

import {
  getAdminModels,
  getModelsBucketUsage,
  updateModel,
  deleteModel,
  publicUrl,
  type AdminModelRow,
  type ModelRow,
  type ModelUpdate,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { formatBytes } from "@/lib/image-compress"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import ModelEditor from "@/components/admin/ModelEditor"
import ModelCreate from "@/components/admin/ModelCreate"

const TIER_BYTES = 1024 * 1024 * 1024 // 1 GB free tier

export default function ModelsManager() {
  const { data, loading, error } = useAsyncData(() => getAdminModels(), [])
  const [models, setModels] = useState<AdminModelRow[]>([])
  const [usage, setUsage] = useState<{ totalBytes: number; objectCount: number } | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (data) setModels(data)
  }, [data])

  const loadUsage = useCallback(async () => {
    try {
      setUsage(await getModelsBucketUsage())
    } catch {
      /* non-critical; leave previous value */
    }
  }, [])
  useEffect(() => {
    loadUsage()
  }, [loadUsage])

  const refreshModels = useCallback(async () => {
    try {
      setModels(await getAdminModels())
    } catch {
      /* keep current list */
    }
  }, [])

  async function handleSaveFields(id: string, fields: ModelUpdate) {
    const prev = models
    setModels((list) => list.map((m) => (m.id === id ? { ...m, ...fields } : m)))
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
    loadUsage()
  }

  function handleGalleryCountChange(id: string, count: number) {
    setModels((list) => list.map((m) => (m.id === id ? { ...m, gallery_count: count } : m)))
  }

  const usedPct = usage ? Math.min(100, (usage.totalBytes / TIER_BYTES) * 100) : 0

  return (
    <div className="px-10 py-12">
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <p className="pbm-eyebrow mb-4">Models</p>
          <h1 className="pbm-display-s">Roster</h1>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="pbm-bar mt-2 w-auto px-6"
        >
          New model →
        </button>
      </div>

      {/* Storage gauge */}
      {usage && (
        <div className="mb-10 max-w-md">
          <div className="flex items-baseline justify-between">
            <span className="pbm-meta-label">Models storage</span>
            <span className="pbm-meta-value">
              {formatBytes(usage.totalBytes)} / 1 GB · {usage.objectCount} files
            </span>
          </div>
          <div className="mt-2 h-1 w-full bg-ink/10">
            <div
              className={cn("h-full", usedPct > 85 ? "bg-error" : "bg-gold")}
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>
      )}

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

      {/* Edit drawer */}
      <Sheet
        open={selectedId !== null}
        onOpenChange={(o) => {
          if (!o) {
            setSelectedId(null)
            loadUsage() // gallery add/delete in the editor may have changed storage
          }
        }}
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

      {/* Create drawer */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="right" className="w-full bg-paper text-ink sm:max-w-xl">
          <SheetTitle className="sr-only">New model</SheetTitle>
          {createOpen && (
            <ModelCreate
              onDone={() => {
                setCreateOpen(false)
                refreshModels()
                loadUsage()
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
