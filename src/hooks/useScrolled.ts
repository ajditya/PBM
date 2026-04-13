import { useEffect, useState } from "react"

/**
 * Returns true once the page has scrolled past `threshold` pixels.
 * Used by the Nav to switch from transparent (over hero) to solid ink state.
 */
export function useScrolled(threshold = 100): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return scrolled
}
