import { useState } from "react"

import {
  clearSiteImageSlotItem,
  clearSiteMedia,
  publicUrl,
  setSiteImageSlot,
  setSiteImageSlotItem,
  setSiteVideoSlot,
  type Json,
} from "@/lib/supabase"
import { toast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import type { SiteMediaSlot } from "@/lib/site-media"
import { compressAndUpload, UploadList, type UploadItem } from "@/components/admin/uploads"

/** Read the stored bucket path out of a single-slot value, or "" if unset. */
function storedUrl(value: Json | undefined): string {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const url = (value as { url?: unknown }).url
    if (typeof url === "string") return url
  }
  return ""
}

/** Read the stored ordered paths out of a multi-slot value (gaps preserved as ""). */
function storedUrls(value: Json | undefined): string[] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const urls = (value as { urls?: unknown }).urls
    if (Array.isArray(urls)) {
      return urls.map((u) => (typeof u === "string" ? u : ""))
    }
  }
  return []
}

/** Read the cache-buster version token out of a slot value, or undefined. */
function storedVersion(value: Json | undefined): string | number | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const v = (value as { v?: unknown }).v
    if (typeof v === "string" || typeof v === "number") return v
  }
  return undefined
}

interface Props {
  slot: SiteMediaSlot
  value: Json | undefined
  /** Patch the parent's in-memory settings map after a successful write. */
  onChange: (key: string, value: Json) => void
}

/**
 * One editable site-media slot. Single image/video slots render a preview +
 * upload + reset; multi slots render `count` fixed positional cells (each its
 * own upload + clear). Images compress to WebP; videos upload raw.
 */
export default function MediaSlotRow({ slot, value, onChange }: Props) {
  return slot.multi ? (
    <MultiImageSlot slot={slot} value={value} onChange={onChange} />
  ) : (
    <SingleSlot slot={slot} value={value} onChange={onChange} />
  )
}

/* ───────── Single image / video ───────── */

function SingleSlot({ slot, value, onChange }: Props) {
  const [item, setItem] = useState<UploadItem | null>(null)
  const [busy, setBusy] = useState(false)

  const stored = storedUrl(value)
  const version = storedVersion(value)
  const hasCustom = stored.length > 0

  async function handleImage(file: File) {
    setBusy(true)
    setItem({ key: slot.key, name: file.name, status: "queued" })
    const ok = await compressAndUpload(
      file,
      async (webp) => {
        const path = await setSiteImageSlot(slot, webp)
        onChange(slot.key, { url: path, v: Date.now() })
      },
      (patch) => setItem((it) => (it ? { ...it, ...patch } : it)),
    )
    toast(
      ok
        ? { message: `${slot.label} updated.` }
        : { variant: "error", message: `Couldn't upload ${slot.label}.` },
    )
    setBusy(false)
  }

  async function handleVideo(file: File) {
    setBusy(true)
    setItem({
      key: slot.key,
      name: file.name,
      status: "uploading",
      originalBytes: file.size,
      uploadedBytes: file.size,
    })
    try {
      const path = await setSiteVideoSlot(slot, file)
      onChange(slot.key, { url: path, v: Date.now() })
      setItem((it) => (it ? { ...it, status: "done" } : it))
      toast({ message: `${slot.label} updated.` })
    } catch (e) {
      setItem((it) =>
        it
          ? { ...it, status: "error", error: e instanceof Error ? e.message : "Upload failed" }
          : it,
      )
      toast({ variant: "error", message: `Couldn't upload ${slot.label}.` })
    }
    setBusy(false)
  }

  async function handleReset() {
    setBusy(true)
    try {
      await clearSiteMedia(slot.key, { url: "" }, stored ? [stored] : [])
      onChange(slot.key, { url: "" })
      setItem(null)
      toast({ message: `${slot.label} reset to default.` })
    } catch {
      toast({ variant: "error", message: `Couldn't reset ${slot.label}.` })
    }
    setBusy(false)
  }

  return (
    <div className="grid grid-cols-[auto_1fr] items-start gap-6">
      {slot.kind === "image" ? (
        <span className="h-24 w-20 shrink-0 overflow-hidden bg-ink/5">
          <img
            src={publicUrl(stored, version) || (slot.fallback as string)}
            alt=""
            draggable={false}
            className="h-full w-full object-cover"
          />
        </span>
      ) : (
        <span className="flex h-24 w-20 shrink-0 items-center justify-center bg-ink/5">
          <span className="pbm-meta-label text-mute">Video</span>
        </span>
      )}

      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="pbm-meta-value">{slot.label}</span>
          <StatusTag custom={hasCustom} />
        </div>

        {slot.hint && <p className="pbm-body mt-2 max-w-md text-mute">{slot.hint}</p>}

        <div className="mt-4 flex items-center gap-6">
          <UploadLabel
            busy={busy}
            accept={slot.kind === "video" ? "video/mp4" : "image/*"}
            label={hasCustom ? "Replace…" : "Upload…"}
            onFile={(f) => (slot.kind === "video" ? handleVideo(f) : handleImage(f))}
          />
          {hasCustom && <ResetButton busy={busy} label="Reset to default" onClick={handleReset} />}
        </div>

        {item && <UploadList items={[item]} />}
      </div>
    </div>
  )
}

/* ───────── Multi image (fixed positional trio) ───────── */

function MultiImageSlot({ slot, value, onChange }: Props) {
  const [items, setItems] = useState<Record<number, UploadItem | undefined>>({})
  const [busy, setBusy] = useState(false)

  const urls = storedUrls(value)
  const version = storedVersion(value)
  const fallback = slot.fallback as readonly string[]
  const count = slot.count ?? fallback.length

  function setItem(index: number, patch: Partial<UploadItem> | null) {
    setItems((m) =>
      patch === null
        ? { ...m, [index]: undefined }
        : { ...m, [index]: m[index] ? { ...m[index]!, ...patch } : (patch as UploadItem) },
    )
  }

  async function handleImage(index: number, file: File) {
    setBusy(true)
    setItem(index, { key: `${slot.key}-${index}`, name: file.name, status: "queued" })
    const ok = await compressAndUpload(
      file,
      async (webp) => {
        const next = await setSiteImageSlotItem(slot, index, webp, urls)
        onChange(slot.key, { urls: next, v: Date.now() })
      },
      (patch) => setItem(index, patch),
    )
    toast(
      ok
        ? { message: `${slot.label} — photo ${index + 1} updated.` }
        : { variant: "error", message: `Couldn't upload photo ${index + 1}.` },
    )
    setBusy(false)
  }

  async function handleClear(index: number) {
    setBusy(true)
    try {
      const next = await clearSiteImageSlotItem(slot, index, urls)
      onChange(slot.key, { urls: next })
      setItem(index, null)
      toast({ message: `${slot.label} — photo ${index + 1} reset to default.` })
    } catch {
      toast({ variant: "error", message: `Couldn't reset photo ${index + 1}.` })
    }
    setBusy(false)
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="pbm-meta-value">{slot.label}</span>
      </div>
      {slot.hint && <p className="pbm-body mt-2 max-w-md text-mute">{slot.hint}</p>}

      <div className="mt-5 flex flex-wrap gap-8">
        {Array.from({ length: count }, (_, i) => {
          const stored = urls[i] ?? ""
          const hasCustom = stored.length > 0
          return (
            <div key={i} className="flex w-24 flex-col gap-3">
              <span className="h-28 w-24 overflow-hidden bg-ink/5">
                <img
                  src={publicUrl(stored, version) || fallback[i]}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="flex items-center gap-2">
                <span className="pbm-meta-label text-mute">{i + 1}</span>
                <StatusTag custom={hasCustom} />
              </div>
              <UploadLabel
                busy={busy}
                accept="image/*"
                label={hasCustom ? "Replace" : "Upload"}
                onFile={(f) => handleImage(i, f)}
              />
              {hasCustom && (
                <ResetButton busy={busy} label="Clear" onClick={() => handleClear(i)} />
              )}
              {items[i] && <UploadList items={[items[i]!]} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ───────── Shared bits ───────── */

function StatusTag({ custom }: { custom: boolean }) {
  return (
    <span
      className={cn(
        "border px-2 py-1 text-[0.625rem] uppercase tracking-[0.2em]",
        custom ? "border-gold text-ink" : "border-hairline text-mute",
      )}
    >
      {custom ? "Custom" : "Default"}
    </span>
  )
}

function UploadLabel({
  busy,
  accept,
  label,
  onFile,
}: {
  busy: boolean
  accept: string
  label: string
  onFile: (file: File) => void
}) {
  return (
    <label
      className={cn(
        "pbm-link cursor-pointer self-start text-ink",
        busy && "pointer-events-none opacity-50",
      )}
    >
      {label}
      <input
        type="file"
        accept={accept}
        className="sr-only"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ""
        }}
      />
    </label>
  )
}

function ResetButton({
  busy,
  label,
  onClick,
}: {
  busy: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="pbm-link self-start text-mute disabled:opacity-50"
    >
      {label}
    </button>
  )
}
