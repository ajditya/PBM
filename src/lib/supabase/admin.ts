import { supabase } from "./client"
import type {
  ApplicationRow,
  ApplicationStatus,
  EventInsert,
  EventRow,
  EventUpdate,
  InquiryRow,
  InquiryStatus,
  Json,
  ModelGalleryRow,
  ModelInsert,
  ModelRow,
  ModelUpdate,
} from "./types"
import type { MindBodySoulContent } from "@/lib/mind-body-soul"

const MODELS_BUCKET = "models"
const EVENTS_BUCKET = "events"

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

/* ───────── Models manager (Phase 3 Part B — create + image uploads) ───────── */

/** Insert a new model row and return its id + slug for the image-upload step. */
export async function createModel(
  fields: ModelInsert,
): Promise<{ id: string; slug: string }> {
  const { data, error } = await supabase
    .from("models")
    .insert(fields)
    .select("id, slug")
    .single()
  if (error) throw error
  return { id: data.id, slug: data.slug }
}

/**
 * Upload a model's cover. The blob is ALREADY the compressed WebP (compression
 * happens client-side before this call). Stored at models/{slug}/cover.webp and
 * the bucket-qualified path is written back to the row. upsert replaces an
 * existing cover at the same path.
 */
export async function setModelCover(
  model: { id: string; slug: string },
  webp: Blob,
): Promise<string> {
  const rel = `${model.slug}/cover.webp`
  const { error: upErr } = await supabase.storage
    .from(MODELS_BUCKET)
    .upload(rel, webp, { contentType: "image/webp", upsert: true })
  if (upErr) throw upErr

  const path = `${MODELS_BUCKET}/${rel}`
  const { error } = await supabase
    .from("models")
    .update({ cover_image: path })
    .eq("id", model.id)
  if (error) throw error
  return path
}

/**
 * Upload one gallery image (already-compressed WebP) to
 * models/{slug}/gallery/{fileIndex}.webp and insert its row at `sortOrder`
 * (0 = primary / slide 1). Returns the inserted row.
 */
export async function addModelGalleryImage(
  model: { id: string; slug: string },
  webp: Blob,
  fileIndex: number,
  sortOrder: number,
): Promise<ModelGalleryRow> {
  const rel = `${model.slug}/gallery/${fileIndex}.webp`
  const { error: upErr } = await supabase.storage
    .from(MODELS_BUCKET)
    .upload(rel, webp, { contentType: "image/webp", upsert: true })
  if (upErr) throw upErr

  const image_path = `${MODELS_BUCKET}/${rel}`
  const { data, error } = await supabase
    .from("model_gallery")
    .insert({ model_id: model.id, image_path, sort_order: sortOrder })
    .select("*")
    .single()
  if (error) throw error
  return data as ModelGalleryRow
}

/** Highest numeric gallery filename in use, so new uploads don't collide. */
export function maxGalleryFileIndex(gallery: ModelGalleryRow[]): number {
  let max = 0
  for (const g of gallery) {
    const m = g.image_path.match(/\/gallery\/(\d+)\.webp$/)
    if (m) max = Math.max(max, Number(m[1]))
  }
  return max
}

/** Total bytes + object count in the public `models` bucket (admin usage gauge). */
export async function getModelsBucketUsage(): Promise<{
  totalBytes: number
  objectCount: number
}> {
  const { data, error } = await supabase.rpc("models_bucket_usage")
  if (error) throw error
  const row = data?.[0]
  return {
    totalBytes: Number(row?.total_bytes ?? 0),
    objectCount: Number(row?.object_count ?? 0),
  }
}

/* ───────── Events manager (Phase 4 Part 1) ───────── */

/** Events bucket paths are bucket-qualified ("events/{slug}/cover.webp"); strip for storage ops. */
function toEventsBucketRelative(path: string): string {
  return path.replace(/^events\//, "")
}

/** List every storage object under events/{slug}/ (root + one level of subfolders). */
async function listEventObjects(slug: string): Promise<string[]> {
  const out: string[] = []
  const { data: top } = await supabase.storage
    .from(EVENTS_BUCKET)
    .list(slug, { limit: 1000 })

  for (const item of top ?? []) {
    // Supabase represents subfolders as entries with a null id.
    if (item.id === null) {
      const { data: sub } = await supabase.storage
        .from(EVENTS_BUCKET)
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
 * ALL events — both types, published AND unpublished (the `events_auth_all` RLS policy lifts
 * the public `published = true` filter for the admin). Ordered by sort_order then event_date.
 */
export async function getAdminEvents(): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("event_date", { ascending: true })

  if (error) throw error
  return data ?? []
}

/** A single event by id, or null if not found. */
export async function getAdminEvent(id: string): Promise<EventRow | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  return (data as EventRow) ?? null
}

/** Insert a new event row and return its id + slug for the cover-upload step. */
export async function createEvent(
  fields: EventInsert,
): Promise<{ id: string; slug: string }> {
  const { data, error } = await supabase
    .from("events")
    .insert(fields)
    .select("id, slug")
    .single()
  if (error) throw error
  return { id: data.id, slug: data.slug }
}

/**
 * Upload an event's cover (already-compressed WebP). Stored at events/{slug}/cover.webp and the
 * bucket-qualified path is written back to the row. upsert replaces an existing cover.
 */
export async function setEventCover(
  event: { id: string; slug: string },
  webp: Blob,
): Promise<string> {
  const rel = `${event.slug}/cover.webp`
  const { error: upErr } = await supabase.storage
    .from(EVENTS_BUCKET)
    .upload(rel, webp, { contentType: "image/webp", upsert: true })
  if (upErr) throw upErr

  const path = `${EVENTS_BUCKET}/${rel}`
  const { error } = await supabase
    .from("events")
    .update({ cover_image: path })
    .eq("id", event.id)
  if (error) throw error
  return path
}

/** Update an event's text/meta fields, type, published, sort_order. */
export async function updateEvent(id: string, fields: EventUpdate): Promise<void> {
  const { error } = await supabase.from("events").update(fields).eq("id", id)
  if (error) throw error
}

/**
 * Demote every flagship event EXCEPT `exceptId` to `property`. The public Events page treats
 * flagship as the single Mega Model Hunt feature block, so only one event may be flagship at a
 * time — promoting an event to flagship calls this first to keep that invariant (auto-demote).
 */
export async function demoteOtherFlagships(exceptId: string): Promise<void> {
  const { error } = await supabase
    .from("events")
    .update({ type: "property" })
    .eq("type", "flagship")
    .neq("id", exceptId)
  if (error) throw error
}

/**
 * Delete an event and ALL of its storage. No table FK-references events, so the row delete is
 * clean — but storage is not cascaded, so we remove objects explicitly first. Union the
 * DB-known cover path with a folder sweep of events/{slug}/ to catch anything untracked.
 * Destructive.
 */
export async function deleteEvent(
  event: Pick<EventRow, "id" | "slug" | "cover_image">,
): Promise<void> {
  const known = [event.cover_image]
    .filter((p): p is string => !!p)
    .map(toEventsBucketRelative)

  const swept = await listEventObjects(event.slug)
  const paths = Array.from(new Set([...known, ...swept]))

  if (paths.length > 0) {
    const { error: storageErr } = await supabase.storage
      .from(EVENTS_BUCKET)
      .remove(paths)
    if (storageErr) throw storageErr
  }

  const { error } = await supabase.from("events").delete().eq("id", event.id)
  if (error) throw error
}

/* ───────── Mind · Body · Soul program content (Phase 4 Part 2) ───────── */

/**
 * Persist the editable Mind · Body · Soul program copy into the `mind_body_soul`
 * `site_settings` row. Upsert on `key` so it's robust even if the seed migration hasn't run.
 * Authenticated-only (anon has SELECT on site_settings; the `*_auth_all` policy grants writes).
 */
export async function updateMindBodySoul(value: MindBodySoulContent): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key: "mind_body_soul", value: value as unknown as Json },
      { onConflict: "key" },
    )
  if (error) throw error
}

/* ───────── Site media (Phase B — Media manager) ───────── */

const SITE_BUCKET = "site"

/** Site bucket paths are bucket-qualified ("site/hero/poster.webp"); strip for storage ops. */
function toSiteBucketRelative(path: string): string {
  return path.replace(/^site\//, "")
}

/**
 * Upsert any `site_settings` row by key — generalizes updateMindBodySoul. The
 * Media manager writes media-slot values ({url} / {urls}) through this. Upsert
 * on `key` so it works even if the seed migration hasn't run. Authenticated-only.
 */
export async function setSiteSetting(key: string, value: Json): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" })
  if (error) throw error
}

/**
 * Reset a media slot to `empty` so the public site reverts to its static
 * default, and best-effort remove the now-orphaned storage object(s) so the
 * `site` bucket doesn't accumulate dead files. A failed storage delete is
 * swallowed — a missing object must never block resetting the row.
 */
export async function clearSiteMedia(
  key: string,
  empty: Json,
  storedPaths: string[] = [],
): Promise<void> {
  const rels = storedPaths.filter(Boolean).map(toSiteBucketRelative)
  if (rels.length > 0) {
    await supabase.storage.from(SITE_BUCKET).remove(rels)
  }
  await setSiteSetting(key, empty)
}

/**
 * Upload a single site image slot (already-compressed WebP, like setModelCover)
 * to site/{storagePath}.webp and write {"url": path} into its site_settings row.
 */
export async function setSiteImageSlot(
  slot: { key: string; storagePath: string },
  webp: Blob,
): Promise<string> {
  const rel = `${slot.storagePath}.webp`
  const { error: upErr } = await supabase.storage
    .from(SITE_BUCKET)
    .upload(rel, webp, { contentType: "image/webp", upsert: true })
  if (upErr) throw upErr

  const path = `${SITE_BUCKET}/${rel}`
  await setSiteSetting(slot.key, { url: path })
  return path
}

/**
 * Write one image into a multi-image slot at `index` (0-based), merging into the
 * existing ordered urls array. Stored at site/{storagePath}/{index + 1}.webp.
 * Returns the new array (also persisted).
 */
export async function setSiteImageSlotItem(
  slot: { key: string; storagePath: string },
  index: number,
  webp: Blob,
  currentUrls: string[],
): Promise<string[]> {
  const rel = `${slot.storagePath}/${index + 1}.webp`
  const { error: upErr } = await supabase.storage
    .from(SITE_BUCKET)
    .upload(rel, webp, { contentType: "image/webp", upsert: true })
  if (upErr) throw upErr

  const next = [...currentUrls]
  next[index] = `${SITE_BUCKET}/${rel}`
  await setSiteSetting(slot.key, { urls: next })
  return next
}

/**
 * Reset ONE position of a multi-image slot to empty (so it reverts to its static
 * default) and remove the orphaned object. The position is blanked in place — the
 * array keeps its length so later positions don't shift. Returns the new array.
 */
export async function clearSiteImageSlotItem(
  slot: { key: string },
  index: number,
  currentUrls: string[],
): Promise<string[]> {
  const target = currentUrls[index]
  if (target) {
    await supabase.storage.from(SITE_BUCKET).remove([toSiteBucketRelative(target)])
  }
  const next = [...currentUrls]
  next[index] = ""
  await setSiteSetting(slot.key, { urls: next })
  return next
}

/**
 * Upload a site VIDEO slot RAW — NO compression (the WebP image path would
 * destroy the video). The hero video is ≈14 MB, under the `site` bucket /
 * project size limit. Stored at site/{storagePath}.{mp4|webm}; {"url": path}
 * written to the row.
 */
export async function setSiteVideoSlot(
  slot: { key: string; storagePath: string },
  file: File,
): Promise<string> {
  const ext = file.name.toLowerCase().endsWith(".webm") ? "webm" : "mp4"
  const rel = `${slot.storagePath}.${ext}`
  const { error: upErr } = await supabase.storage
    .from(SITE_BUCKET)
    .upload(rel, file, {
      contentType: file.type || "video/mp4",
      upsert: true,
    })
  if (upErr) throw upErr

  const path = `${SITE_BUCKET}/${rel}`
  await setSiteSetting(slot.key, { url: path })
  return path
}
