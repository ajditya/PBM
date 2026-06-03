import { useEffect, useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"

/* ────────────────────────────────────────────────────────────
 * ScrollToTop — resets scroll position on every in-app route
 * change. The app uses <BrowserRouter> + <Routes> (not a data
 * router), so react-router's <ScrollRestoration> is unavailable;
 * this is the manual equivalent.
 *
 * Jump is "instant" on purpose: index.css sets
 * `scroll-behavior: smooth` on <html>, which would otherwise
 * animate the jump and let the new page flash in mid-scroll.
 * The page-transition curtain covers the reset.
 * ──────────────────────────────────────────────────────────── */

export default function ScrollToTop() {
  const { pathname } = useLocation()

  // Stop the browser from restoring the previous scroll offset.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
  }, [])

  // Reset before paint (pre-empts the flash), then again on the next
  // frame to win against late one-off scrolls from the new page's
  // entrance animations / layout settling.
  useLayoutEffect(() => {
    const toTop = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
    toTop()
    const raf = requestAnimationFrame(toTop)
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return null
}
