import { cn } from "@/lib/utils"

/**
 * Status chip in the brand idiom — a hairline rectangle (0px radius), tracked
 * micro-caps. `new` carries a small gold dot so unactioned items read at a
 * glance. Display-only; the status *control* lives on the detail views.
 */
export default function StatusPill({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const isNew = status === "new"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-1",
        "font-sans uppercase text-[0.625rem] font-normal tracking-[0.2em]",
        isNew ? "border-gold text-ink" : "border-hairline text-mute",
        className,
      )}
    >
      {isNew && <span aria-hidden className="h-1 w-1 bg-gold" />}
      {status}
    </span>
  )
}
