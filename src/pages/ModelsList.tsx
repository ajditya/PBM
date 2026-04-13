import { useLocation } from "react-router-dom"

export default function ModelsList() {
  const { pathname } = useLocation()
  const gender = pathname.includes("male") && !pathname.includes("female") ? "Men" : "Women"
  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-mute mb-6">
          Phase 0 — Stub
        </p>
        <h1 className="font-display text-7xl md:text-9xl tracking-tight">{gender}.</h1>
        <p className="mt-8 text-mute text-sm tracking-[0.02em]">Asymmetric grid arrives in Phase 4.</p>
      </div>
    </main>
  )
}
