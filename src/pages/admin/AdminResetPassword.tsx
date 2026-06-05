import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/supabase/auth"

const EASE = [0.22, 1, 0.36, 1] as const
const MIN_LEN = 8

/**
 * Landing page for the password-reset email link. supabase-js detects the
 * recovery token in the URL and establishes a temporary session, so
 * updatePassword() can set the new password. On success the admin is signed in
 * and sent to /admin.
 */
export default function AdminResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)

    if (password.length < MIN_LEN) {
      setError(`Use at least ${MIN_LEN} characters.`)
      return
    }
    if (password !== confirm) {
      setError("Those passwords don't match.")
      return
    }

    setSubmitting(true)
    const { error } = await updatePassword(password)
    if (error) {
      // Most often: the recovery link expired or was already used.
      setError("This reset link is invalid or has expired. Request a new one.")
      setSubmitting(false)
      return
    }
    navigate("/admin", { replace: true })
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-sm"
      >
        <p className="pbm-eyebrow mb-4">Prasad Bidapa</p>
        <h1 className="pbm-display-s mb-10">New password</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          <div className="flex flex-col">
            <label htmlFor="new-password" className="pbm-meta-label mb-2">
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirm-password" className="pbm-meta-label mb-2">
              Confirm password
            </label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!error}
            />
          </div>

          {error && (
            <p className="text-error text-[0.75rem] tracking-[0.02em] -mt-4" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="pbm-bar mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Set password →"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
