import { useEffect, useRef, useState } from "react"
import { Reorder } from "framer-motion"
import { GripVertical, Trash2 } from "lucide-react"

import { publicUrl, type ModelGalleryRow } from "@/lib/supabase"
import { cn } from "@/lib/utils"

/**
 * Drag-to-reorder gallery with per-image delete. Order is committed on drop via
 * onReorderCommit (sort_order = index, so index 0 is the primary slide-1 image
 * the public model page shows). These are the PUBLIC `models` bucket, so plain
 * publicUrl() is correct here — no signed URLs needed (unlike applications).
 */
export default function GalleryManager({
  gallery,
  onReorderCommit,
  onDeleteImage,
}: {
  gallery: ModelGalleryRow[]
  onReorderCommit: (orderedIds: string[]) => Promise<void>
  onDeleteImage: (image: ModelGalleryRow) => Promise<void>
}) {
  const [items, setItems] = useState(gallery)
  const orderRef = useRef(items)
  // Re-sync whenever the source gallery changes (model switch, or a revert).
  useEffect(() => {
    setItems(gallery)
    orderRef.current = gallery
  }, [gallery])

  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  function handleReorder(next: ModelGalleryRow[]) {
    setItems(next)
    orderRef.current = next
  }

  async function commitOrder() {
    const ordered = orderRef.current.map((i) => i.id)
    if (ordered.join() === gallery.map((i) => i.id).join()) return // unchanged
    setSavingOrder(true)
    try {
      await onReorderCommit(ordered)
    } finally {
      setSavingOrder(false)
    }
  }

  if (items.length === 0) {
    return <p className="pbm-body text-mute">No gallery images.</p>
  }

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={handleReorder}
      className="flex flex-col gap-2"
    >
      {items.map((img, index) => (
        <Reorder.Item
          key={img.id}
          value={img}
          onDragEnd={commitOrder}
          className={cn(
            "flex items-center gap-3 border border-hairline bg-paper p-2",
            savingOrder && "opacity-70",
          )}
        >
          <GripVertical
            aria-hidden
            className="h-4 w-4 shrink-0 cursor-grab text-mute"
          />
          <img
            src={publicUrl(img.image_path)}
            alt=""
            draggable={false}
            className="h-16 w-12 shrink-0 select-none object-cover"
          />
          <span className="min-w-0 flex-1">
            {index === 0 ? (
              <span className="pbm-eyebrow">Primary</span>
            ) : (
              <span className="pbm-meta-label">#{index + 1}</span>
            )}
          </span>

          {confirmId === img.id ? (
            <span className="flex shrink-0 items-center gap-3 pr-1">
              <button
                type="button"
                onClick={async () => {
                  setConfirmId(null)
                  await onDeleteImage(img)
                }}
                className="pbm-meta-label text-error"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="pbm-meta-label text-mute"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmId(img.id)}
              className="shrink-0 p-1 text-mute transition-colors hover:text-error"
              aria-label="Delete image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
