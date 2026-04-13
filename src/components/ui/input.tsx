import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Editorial underline-only input.
 * - No box, no rounded corners, no shadow.
 * - 1px ink bottom border.
 * - Focus: 2px gold underline + label turns gold (handle label color in form layer).
 * - aria-invalid: red bottom border.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "block w-full min-w-0 bg-transparent px-0 py-3 text-base text-ink",
        "border-0 border-b border-ink",
        "outline-none transition-colors",
        "placeholder:text-mute placeholder:font-light",
        "focus-visible:border-b-2 focus-visible:border-gold focus-visible:pb-[10px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-error aria-invalid:focus-visible:border-error",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
        className
      )}
      {...props}
    />
  )
}

export { Input }
