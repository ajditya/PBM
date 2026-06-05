import { supabase } from "./client"
import type { ApplicationInsert, InquiryInsert } from "./types"

/**
 * Write-side data access for the public forms.
 *
 * IMPORTANT — never chain `.select()` here. Anon has INSERT but **no SELECT**
 * policy on `inquiries` / `model_applications` (Phase A, by design), so a
 * chained select returns empty data and surfaces a misleading error even though
 * the row was written. Insert, check `error`, done.
 */

/** Lightweight email shape check shared by all three forms. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

/** Insert a contact / booking inquiry. Resolves on success, throws on error. */
export async function createInquiry(input: InquiryInsert): Promise<void> {
  const { error } = await supabase.from("inquiries").insert(input)
  if (error) throw error
}

/** Insert a model application row. Resolves on success, throws on error. */
export async function createApplication(input: ApplicationInsert): Promise<void> {
  const { error } = await supabase.from("model_applications").insert(input)
  if (error) throw error
}

/* ───────── Become-a-Model photo upload (Edge Function) ───────── */

/** Metadata the client declares for each file it wants to upload. */
export interface UploadFileMeta {
  name: string
  type: string
  size: number
}

/** One signed upload target returned by the Edge Function. */
export interface SignedUpload {
  path: string
  token: string
}

export interface SignUploadsResult {
  /** Server-generated folder prefix; also used as the application row id. */
  applicationId: string
  uploads: SignedUpload[]
}

/**
 * Ask the `application-upload` Edge Function for short-lived signed upload URLs
 * scoped to the private `applications` bucket. The function validates count /
 * mime / size server-side and holds the service key — none of that touches the
 * browser. The client then uploads each file directly to its signed URL.
 */
export async function signApplicationUploads(
  files: UploadFileMeta[],
): Promise<SignUploadsResult> {
  const { data, error } = await supabase.functions.invoke<SignUploadsResult>(
    "application-upload",
    { body: { files } },
  )
  if (error) throw error
  if (!data) throw new Error("No response from application-upload function")
  return data
}
