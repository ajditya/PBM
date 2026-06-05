import { useState, type FormEvent } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/supabase/auth"

const EASE = [0.22, 1, 0.36, 1] as const

type Mode = "signin" | "reset"

/**
 * Admin sign-in. Editorial, brand-consistent, intentionally outside the public
 * Layout (no Nav/Footer). Wrong credentials surface a calm line, never the raw
 * Supabase error. An already-authenticated admin is bounced straight to /admin.
 * A "Forgot password?" toggle emails a reset link (lands on /admin/reset-password).
 */
export default function AdminLogin() {
  const { session, loading, signIn, requestPasswordReset } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Already logged in (or it resolves mid-session) → go to the dashboard.
  if (!loading && session) return <Navigate to="/admin" replace />

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  async function handleSignIn() {
    const { error } = await signIn(email.trim(), password)
    if (error) {
      setError("Those credentials didn't match.")
      setSubmitting(false)
      return
    }
    navigate("/admin", { replace: true })
  }

  async function handleReset() {
    await requestPasswordReset(email.trim())
    // Always calm + identical regardless of whether the account exists.
    setNotice("If that account exists, a reset link is on its way.")
    setSubmitting(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setNotice(null)
    setSubmitting(true)
    if (mode === "signin") await handleSignIn()
    else await handleReset()
  }

  const isReset = mode === "reset"

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-sm"
      >
        <p className="pbm-eyebrow mb-4">Prasad Bidapa</p>
        <h1 className="pbm-display-s mb-10">{isReset ? "Reset password" : "Admin"}</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          <div className="flex flex-col">
            <label htmlFor="admin-email" className="pbm-meta-label mb-2">
              Email
            </label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
            />
          </div>

          {!isReset && (
            <div className="flex flex-col">
              <label htmlFor="admin-password" className="pbm-meta-label mb-2">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
              />
            </div>
          )}

          {error && (
            <p className="text-error text-[0.75rem] tracking-[0.02em] -mt-4" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-mute text-[0.75rem] tracking-[0.02em] -mt-4" role="status">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="pbm-bar mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReset
              ? submitting
                ? "Sending…"
                : "Send reset link →"
              : submitting
                ? "Signing in…"
                : "Sign in →"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => switchMode(isReset ? "signin" : "reset")}
          className="pbm-link mt-8 text-mute hover:text-ink"
        >
          {isReset ? "Back to sign in" : "Forgot password?"}
        </button>
      </motion.div>
    </div>
  )
}
