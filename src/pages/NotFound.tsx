import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold mb-6">Error · 404</p>
        <h1 className="font-display text-7xl md:text-9xl tracking-tight">Page not / found.</h1>
        <Link to="/" className="pbm-link mt-12 inline-flex">← Return Home</Link>
      </div>
    </main>
  )
}
