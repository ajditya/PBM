import { NavLink, Outlet, useNavigate } from "react-router-dom"

import { useAuth } from "@/lib/supabase/auth"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { to: "/admin/inbox", label: "Inbox" },
  { to: "/admin/models", label: "Models" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/home", label: "Homepage" },
  { to: "/admin/about", label: "About" },
  { to: "/admin/team", label: "Team" },
] as const

/**
 * Admin chrome — a persistent left sidebar, deliberately distinct from the
 * public Nav/Footer but built from the same tokens (paper/ink/gold, Playfair,
 * 0px radius, hairlines). Renders an <Outlet> for the admin child routes.
 */
export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      <aside className="w-60 shrink-0 border-r border-hairline flex flex-col">
        {/* Monogram */}
        <NavLink
          to="/admin"
          end
          className="px-6 py-7 border-b border-hairline block"
        >
          <span className="font-display text-2xl tracking-tight">PB</span>
          <span className="pbm-meta-label block mt-1">Admin</span>
        </NavLink>

        {/* Section nav */}
        <nav className="flex flex-col py-4">
          {SECTIONS.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              className={({ isActive }) =>
                cn(
                  "pbm-ui px-6 py-3 text-[0.75rem] transition-colors",
                  isActive ? "text-ink" : "text-mute hover:text-ink",
                )
              }
            >
              {s.label}
            </NavLink>
          ))}
        </nav>

        {/* Account / sign out pinned to the bottom */}
        <div className="mt-auto border-t border-hairline px-6 py-5">
          <p className="pbm-meta-label">Signed in</p>
          <p className="pbm-meta-value mt-1 break-all">{user?.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="pbm-link mt-4 text-ink"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
