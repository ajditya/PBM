import { supabase } from "./client"
import type {
  ApplicationRow,
  ApplicationStatus,
  InquiryRow,
  InquiryStatus,
  ModelRow,
} from "./types"

/**
 * Admin-only data access. Every call here runs through the SAME supabase client
 * as the public site, but only resolves meaningfully once the admin is signed
 * in: the `*_auth_all` RLS policies grant the `authenticated` role full access
 * to `inquiries` / `model_applications`, while `anon` has INSERT-only and no
 * SELECT. A logged-out caller therefore gets empty/denied results — the guard
 * is the UI layer; RLS is the real fence.
 */

/** An inquiry row with the linked model's name/slug resolved (null if unset). */
export interface InquiryWithModel extends InquiryRow {
  model: Pick<ModelRow, "name" | "slug"> | null
}

/** All inquiries, newest first, with "re: [model]" name joined where set. */
export async function getInquiries(): Promise<InquiryWithModel[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*, model:models(name, slug)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as InquiryWithModel[]) ?? []
}

/** All model applications, newest first. */
export async function getApplications(): Promise<ApplicationRow[]> {
  const { data, error } = await supabase
    .from("model_applications")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as ApplicationRow[]) ?? []
}

/** `photo_paths` is a jsonb column; normalise it to a string[] of bucket paths. */
export function applicationPhotoPaths(row: ApplicationRow): string[] {
  return Array.isArray(row.photo_paths)
    ? (row.photo_paths.filter((p): p is string => typeof p === "string"))
    : []
}

/** A photo path paired with its freshly-minted, short-lived signed URL. */
export interface SignedPhoto {
  path: string
  /** null when this specific object failed to sign. */
  url: string | null
}

/**
 * Mint short-lived signed URLs for applicant photos in the PRIVATE `applications`
 * bucket, via the authenticated session (the B3 read path). These images are
 * sensitive — applicants are real people and often minors-adjacent — so they
 * must ALWAYS load through fresh, expiring signed URLs behind admin auth.
 * NEVER build a public URL for this bucket, and never persist/cache these URLs:
 * they expire (see ttlSeconds) and re-signing on demand is the point.
 */
export async function signApplicationPhotos(
  paths: string[],
  ttlSeconds = 120,
): Promise<SignedPhoto[]> {
  if (paths.length === 0) return []

  const { data, error } = await supabase.storage
    .from("applications")
    .createSignedUrls(paths, ttlSeconds)

  if (error) throw error

  // createSignedUrls preserves input order and reports per-object errors.
  return (data ?? []).map((d) => ({
    path: d.path ?? "",
    url: d.error ? null : d.signedUrl,
  }))
}

/* ───────── Status mutations (the only writes in this phase) ───────── */

/**
 * Move an inquiry along its lifecycle (new → read → contacted). Authenticated
 * RLS (`inquiries_auth_all`) permits the UPDATE; anon cannot. Resolves on
 * success, throws on error so the caller can revert an optimistic update.
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<void> {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id)
  if (error) throw error
}

/** Move an application along its lifecycle (new → reviewing → shortlisted → archived). */
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  const { error } = await supabase
    .from("model_applications")
    .update({ status })
    .eq("id", id)
  if (error) throw error
}
