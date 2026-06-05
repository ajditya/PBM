import { useState } from "react"
import { ChevronDown } from "lucide-react"

/**
 * Status *control* — deliberately reads as an editable field, not the display
 * pill: a "Set status" label, an underlined select, and a chevron affordance.
 * onChange is async; the control disables itself while the write is in flight.
 * The optimistic value lives in the parent, so the select reflects the new
 * status immediately (and snaps back if the parent reverts on error).
 */
export default function StatusControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: readonly T[]
  onChange: (next: T) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)

  async function handle(next: T) {
    if (next === value) return
    setSaving(true)
    try {
      await onChange(next)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="pbm-meta-label">Set status</span>
      <div className="relative inline-flex w-full max-w-[16rem] items-center">
        <select
          value={value}
          disabled={saving}
          onChange={(e) => handle(e.target.value as T)}
          className="pbm-ui w-full appearance-none border-b border-ink bg-transparent py-2 pr-8 text-[0.75rem] capitalize text-ink outline-none transition-colors focus-visible:border-gold disabled:opacity-50"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="normal-case">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-0 h-4 w-4 text-mute"
        />
      </div>
    </div>
  )
}
