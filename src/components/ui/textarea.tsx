import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Editorial underline-only textarea.
 * Matches Input — no box, only ink bottom border, gold focus, red error.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "block w-full min-h-[6rem] bg-transparent px-0 py-3 text-base text-ink resize-none",
        "border-0 border-b border-ink",
        "outline-none transition-colors",
        "placeholder:text-mute placeholder:font-light",
        "focus-visible:border-b-2 focus-visible:border-gold focus-visible:pb-[10px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-error aria-invalid:focus-visible:border-error",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
