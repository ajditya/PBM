import { supabase } from "./client"
import type {
  ApplicationRow,
  ApplicationStatus,
  InquiryRow,
  InquiryStatus,
  ModelGalleryRow,
  ModelRow,
  ModelUpdate,
} from "./types"

const MODELS_BUCKET = "models"

/**
 * Stored image paths are bucket-qualified (e.g. "models/amber/cover.webp") so
 * publicUrl() can prefix the public base directly. Storage `.remove()` / `.list()`,
 * however, operate on paths RELATIVE to the bucket — strip the leading "models/".
 */
function toBucketRelative(path: string): string {
  return path.replace(/^models\//, "")
}

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

/* ───────── Models manager (Phase 3 Part A — edit only, no uploads) ───────── */

/** A model row plus its gallery image count, for the admin list. */
export interface AdminModelRow extends ModelRow {
  gallery_count: number
}

/**
 * ALL models — both genders, published AND unpublished (the `models_auth_all`
 * RLS policy lifts the public `published = true` filter for the admin). Ordered
 * by sort_order then name, with a gallery count per row.
 */
export async function getAdminModels(): Promise<AdminModelRow[]> {
  const { data, error } = await supabase
    .from("models")
    .select("*, model_gallery(count)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw error
  return (data ?? []).map((m) => {
    const { model_gallery, ...row } = m as ModelRow & {
      model_gallery: { count: number }[]
    }
    return { ...(row as ModelRow), gallery_count: model_gallery?.[0]?.count ?? 0 }
  })
}

/** A single model with its full gallery, ordered by sort_order (slide 1 = primary). */
export interface AdminModelWithGallery extends ModelRow {
  gallery: ModelGalleryRow[]
}

export async function getAdminModel(id: string): Promise<AdminModelWithGallery | null> {
  const { data, error } = await supabase
    .from("models")
    .select("*, gallery:model_gallery(*)")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const gallery = [...((data.gallery as ModelGalleryRow[]) ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  return { ...(data as ModelRow), gallery }
}

/** Update a model's text/stat fields, featured, published, sort_order, board. */
export async function updateModel(id: string, fields: ModelUpdate): Promise<void> {
  const { error } = await supabase.from("models").update(fields).eq("id", id)
  if (error) throw error
}

/**
 * Persist a new gallery order: sort_order becomes the array index, so index 0
 * is the primary image the public model page shows as slide 1. Scoped to the
 * model so a stale id can't touch another model's rows.
 */
export async function updateGalleryOrder(
  modelId: string,
  orderedIds: string[],
): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("model_gallery")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("model_id", modelId),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

/**
 * Delete one gallery image: remove the storage object FIRST, then the row. If
 * the storage delete fails we throw before touching the row, so nothing is half
 * deleted and the admin can retry cleanly — no orphaned DB row pointing at a
 * missing file, no orphaned file with no row.
 */
export async function deleteGalleryImage(
  galleryId: string,
  imagePath: string,
): Promise<void> {
  const { error: storageErr } = await supabase.storage
    .from(MODELS_BUCKET)
    .remove([toBucketRelative(imagePath)])
  if (storageErr) throw storageErr

  const { error } = await supabase.from("model_gallery").delete().eq("id", galleryId)
  if (error) throw error
}

/** List every storage object under models/{slug}/ (root + one level of subfolders). */
async function listModelObjects(slug: string): Promise<string[]> {
  const out: string[] = []
  const { data: top } = await supabase.storage
    .from(MODELS_BUCKET)
    .list(slug, { limit: 1000 })

  for (const item of top ?? []) {
    // Supabase represents subfolders as entries with a null id.
    if (item.id === null) {
      const { data: sub } = await supabase.storage
        .from(MODELS_BUCKET)
        .list(`${slug}/${item.name}`, { limit: 1000 })
      for (const f of sub ?? []) {
        if (f.id !== null) out.push(`${slug}/${item.name}/${f.name}`)
      }
    } else {
      out.push(`${slug}/${item.name}`)
    }
  }
  return out
}

/**
 * Delete a model and ALL of its storage. The model_gallery FK is ON DELETE
 * CASCADE, so deleting the row removes its gallery rows automatically — but
 * storage is NOT cascaded, so we remove the objects explicitly first. We union
 * the DB-known paths (cover + gallery rows) with a folder sweep of
 * models/{slug}/ to catch anything not tracked in a row. Destructive.
 */
export async function deleteModel(
  model: Pick<ModelRow, "id" | "slug" | "cover_image">,
): Promise<void> {
  const { data: galleryRows } = await supabase
    .from("model_gallery")
    .select("image_path")
    .eq("model_id", model.id)

  const known = [model.cover_image, ...(galleryRows ?? []).map((r) => r.image_path)]
    .filter((p): p is string => !!p)
    .map(toBucketRelative)

  const swept = await listModelObjects(model.slug)
  const paths = Array.from(new Set([...known, ...swept]))

  if (paths.length > 0) {
    const { error: storageErr } = await supabase.storage
      .from(MODELS_BUCKET)
      .remove(paths)
    if (storageErr) throw storageErr
  }

  const { error } = await supabase.from("models").delete().eq("id", model.id)
  if (error) throw error
}
