import { Outlet } from "react-router-dom"

import Nav from "@/components/layout/Nav"
import Footer from "@/components/layout/Footer"
import PageTransition from "@/components/layout/PageTransition"

export default function Layout() {
  return (
    <div className="relative min-h-screen bg-paper text-ink antialiased">
      <Nav />
      <Outlet />
      <Footer />
      <PageTransition />
    </div>
  )
}
