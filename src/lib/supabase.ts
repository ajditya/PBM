import { createClient } from "@supabase/supabase-js"

/**
 * Supabase client. NOT used during the UI build phase — kept here as scaffolding
 * so functionality work in Phase 12 can wire in immediately. See CLAUDE.md.
 *
 * Required env vars (in `.env.local`):
 *   VITE_SUPABASE_URL=
 *   VITE_SUPABASE_ANON_KEY=
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase =
  url && anonKey
    ? createClient(url, anonKey)
    : null

export const supabaseConfigured = Boolean(url && anonKey)
