import { Link } from "react-router-dom"

/**
 * Dashboard home — admin overview landing with a guide to each section.
 */
const SECTIONS = [
  {
    to: "/admin/inbox",
    label: "Inbox",
    description:
      "Messages from the site — contact inquiries and model applications, each flagged when new.",
  },
  {
    to: "/admin/models",
    label: "Models",
    description:
      "The model roster. Add, edit, and order profiles, manage each model's gallery, and watch storage usage.",
  },
  {
    to: "/admin/events",
    label: "Events",
    description:
      "Events shown on the public Events page, plus the Mind Body Soul grooming-program band.",
  },
  {
    to: "/admin/media",
    label: "Media",
    description:
      "The site-wide media library. Swap the hero, About, and other imagery or video used across the public site.",
  },
]

export default function AdminHome() {
  return (
    <div className="px-10 py-12 max-w-3xl">
      <p className="pbm-eyebrow mb-4">Dashboard</p>
      <h1 className="pbm-display-s mb-8">Welcome back.</h1>
      <div className="border-t border-hairline">
        {SECTIONS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="block border-b border-hairline py-6 group"
          >
            <p className="pbm-meta-label mb-2 group-hover:text-ink transition-colors">
              {s.label}
            </p>
            <p className="pbm-body max-w-prose text-mute">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
