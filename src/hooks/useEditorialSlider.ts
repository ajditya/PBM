import { useCallback, useEffect, useState } from "react"

import { modelGalleryPool } from "@/lib/placeholder-assets"

/* ────────────────────────────────────────────────────────────
 * useEditorialSlider — owns the slider's index/direction state
 * and keyboard navigation, so the image stage and the navigation
 * controls can be rendered in separate layout cells while sharing
 * one source of truth. See `components/EditorialSlider.tsx`.
 * ──────────────────────────────────────────────────────────── */

export interface EditorialSliderState {
  source: readonly string[]
  safeIndex: number
  total: number
  direction: 1 | -1
  progress: number
  goPrev: () => void
  goNext: () => void
  goTo: (i: number) => void
}

export function useEditorialSlider(
  pool?: readonly string[],
): EditorialSliderState {
  const source = pool && pool.length > 0 ? pool : modelGalleryPool
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const total = source.length
  const safeIndex = Math.min(index, total - 1)

  const goPrev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const goNext = useCallback(() => {
    setDirection(1)
    setIndex((i) => (i + 1) % total)
  }, [total])

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > safeIndex ? 1 : -1)
      setIndex(i)
    },
    [safeIndex],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goPrev, goNext])

  const progress = total <= 1 ? 1 : (safeIndex + 1) / total

  return { source, safeIndex, total, direction, progress, goPrev, goNext, goTo }
}
