import { useEffect } from "react"
import { Outlet } from "react-router-dom"

import Nav from "@/components/layout/Nav"
import Footer from "@/components/layout/Footer"
import PageTransition from "@/components/layout/PageTransition"
import CookieBanner from "@/components/CookieBanner"
import { ToastViewport } from "@/components/Toast"

export default function Layout() {
  // Block context menu and drag on every <img>. Purely a deterrent — any
  // determined visitor can still pull assets from devtools — but it stops
  // the casual save-as on portfolio and gallery imagery.
  useEffect(() => {
    const block = (e: Event) => {
      const el = e.target as HTMLElement | null
      if (el && el.tagName === "IMG") e.preventDefault()
    }
    document.addEventListener("contextmenu", block)
    document.addEventListener("dragstart", block)
    return () => {
      document.removeEventListener("contextmenu", block)
      document.removeEventListener("dragstart", block)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-paper text-ink antialiased">
      <Nav />
      <Outlet />
      <Footer />
      <PageTransition />
      <CookieBanner />
      <ToastViewport />
    </div>
  )
}
