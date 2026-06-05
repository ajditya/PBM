import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

/**
 * Public (anon) Supabase client — read-only against RLS-protected tables.
 * Reads VITE_ env vars from .env.local. The anon key is safe to ship to the
 * browser; the service_role key must NEVER live here (see scripts/ migration).
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — check .env.local",
  )
}

export const supabase = createClient<Database>(url, anonKey)
export const SUPABASE_URL = url
