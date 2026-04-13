import { useParams } from "react-router-dom"

export default function ModelDetail() {
  const { slug } = useParams()
  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-mute mb-6">
          Phase 0 — Stub · {slug}
        </p>
        <h1 className="font-display text-7xl md:text-9xl tracking-tight">Model Detail.</h1>
        <p className="mt-8 text-mute text-sm tracking-[0.02em]">Split hero + gallery arrive in Phase 5.</p>
      </div>
    </main>
  )
}
