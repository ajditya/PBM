/**
 * Dashboard home — placeholder for Phase 1. The real overview (inbox counts,
 * recent activity) lands once the data features are built on top of this shell.
 */
export default function AdminHome() {
  return (
    <div className="px-10 py-12 max-w-3xl">
      <p className="pbm-eyebrow mb-4">Dashboard</p>
      <h1 className="pbm-display-s mb-6">Welcome back.</h1>
      <div className="border-t border-hairline pt-6">
        <p className="pbm-body max-w-prose">
          This is the admin shell. Inbox, Models, Events, and Media will live
          here once their features are built — for now the foundation (sign-in,
          protected routes, and this chrome) is in place.
        </p>
        <p className="pbm-meta-label mt-6">Phase 1 — shell only</p>
      </div>
    </div>
  )
}
