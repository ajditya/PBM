import { useEffect, useState } from "react"

/* ────────────────────────────────────────────────────────────
 * Tiny global toast store.
 *
 * Components import `toast(...)` from anywhere to push a notice.
 * The <ToastViewport /> mounted in Layout.tsx subscribes via
 * useToasts() and renders the active queue.
 *
 * No third-party dependency, no provider wrapper required.
 * ──────────────────────────────────────────────────────────── */

export type ToastVariant = "default" | "error"

export interface Toast {
  id: number
  label?: string
  message: string
  variant: ToastVariant
}

export interface ToastInput {
  label?: string
  message: string
  variant?: ToastVariant
  /** Auto-dismiss timeout in ms. Default 4500. Pass 0 to disable. */
  duration?: number
}

let nextId = 1
let listeners: Array<(toasts: Toast[]) => void> = []
let queue: Toast[] = []

function emit() {
  listeners.forEach((l) => l(queue))
}

export function toast(input: ToastInput) {
  const t: Toast = {
    id: nextId++,
    label: input.label,
    message: input.message,
    variant: input.variant ?? "default",
  }
  queue = [...queue, t]
  emit()

  const duration = input.duration ?? 4500
  if (duration > 0) {
    setTimeout(() => dismissToast(t.id), duration)
  }
  return t.id
}

export function dismissToast(id: number) {
  queue = queue.filter((t) => t.id !== id)
  emit()
}

export function useToasts(): Toast[] {
  const [toasts, setToasts] = useState<Toast[]>(queue)

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return toasts
}
