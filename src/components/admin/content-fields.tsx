import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/* ────────────────────────────────────────────────────────────
 * Small labelled form atoms shared by the content editors
 * (HomeManager / AboutManager). Each is controlled — value in,
 * change out — so the parent owns the form state.
 * ──────────────────────────────────────────────────────────── */

/** Single-line text field. */
export function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const id = useId()
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="pbm-meta-label mb-2">
        {label}
      </label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

/** Multi-line text field. `hint` notes things like "one line per row". */
export function AreaField({
  label,
  value,
  onChange,
  hint,
  minHeight = "6rem",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
  minHeight?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="pbm-meta-label mb-2">
        {label}
      </label>
      {hint && <p className="pbm-body mb-2 text-mute">{hint}</p>}
      <Textarea
        id={id}
        style={{ minHeight }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

/** Editable list of body paragraphs (string[]): edit, remove, add, reorder. */
export function ParagraphsField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
}) {
  function update(i: number, v: string) {
    onChange(value.map((p, idx) => (idx === i ? v : p)))
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="flex flex-col">
      <span className="pbm-meta-label mb-2">{label}</span>
      <div className="flex flex-col gap-4">
        {value.map((para, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Textarea
              value={para}
              className="min-h-[6rem]"
              onChange={(e) => update(i, e.target.value)}
            />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="pbm-link text-mute disabled:opacity-30"
              >
                ↑ Up
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                className="pbm-link text-mute disabled:opacity-30"
              >
                ↓ Down
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="pbm-link text-error"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="pbm-link mt-4 self-start text-ink"
      >
        + Add paragraph
      </button>
    </div>
  )
}

/** Section divider with an eyebrow label inside a content editor. */
export function FieldGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-12 border-t border-hairline pt-8 first:mt-0 first:border-0 first:pt-0">
      <p className="pbm-eyebrow-mute mb-6">{title}</p>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

/** The sticky-ish save button shared by content editors. */
export function SaveBar({
  saving,
  onSave,
  label = "Save changes →",
}: {
  saving: boolean
  onSave: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="pbm-bar mt-12 w-auto px-6 disabled:opacity-50"
    >
      {saving ? "Saving…" : label}
    </button>
  )
}
