import { cn } from "@/lib/utils"

/**
 * Editorial on/off toggle — a 0px-radius rectangle track with a square knob.
 * Filled ink = on. Used for `featured` / `published`.
 */
export default function AdminToggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 border-b border-hairline py-3 text-left disabled:opacity-50"
    >
      <span className="pbm-meta-label">{label}</span>
      <span
        aria-hidden
        className={cn(
          "relative h-4 w-7 border transition-colors",
          checked ? "border-ink bg-ink" : "border-hairline bg-transparent",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-[10px] w-[10px] transition-all",
            checked ? "left-[14px] bg-paper" : "left-[2px] bg-ink/40",
          )}
        />
      </span>
    </button>
  )
}
