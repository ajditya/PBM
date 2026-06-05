import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/lib/supabase/auth"

/**
 * Route guard for every /admin/* route except /admin/login. While the initial
 * session resolves it shows a calm brand-consistent loading state (never a
 * flash of the login page). No session → bounce to /admin/login.
 */
export default function RequireAuth() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p className="pbm-eyebrow-mute animate-pulse">Prasad Bidapa</p>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
