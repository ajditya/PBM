import { supabase } from "./client"
import type { EventRow, ModelGalleryRow, ModelGender, ModelRow } from "./types"
import {
  DEFAULT_MIND_BODY_SOUL,
  type MindBodySoulContent,
} from "@/lib/mind-body-soul"

/**
 * Read-only data access for the public site. Anon RLS automatically restricts
 * results to published rows, so callers never filter on `published`.
 */

/** All published models, optionally filtered by gender. Ordered sort_order → name. */
export async function getModels(gender?: ModelGender): Promise<ModelRow[]> {
  let query = supabase
    .from("models")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })

  if (gender) query = query.eq("gender", gender)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export interface ModelWithGallery extends ModelRow {
  /** Gallery images ordered by sort_order (slide 1 = primary). */
  gallery: ModelGalleryRow[]
}

/** One model by slug with its ordered gallery, or null if not found / unpublished. */
export async function getModelBySlug(slug: string): Promise<ModelWithGallery | null> {
  const { data, error } = await supabase
    .from("models")
    .select("*, gallery:model_gallery(*)")
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const gallery = [...((data.gallery as ModelGalleryRow[]) ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  return { ...(data as ModelRow), gallery }
}

/** All published events ordered by sort_order (flagship + properties together). */
export async function getEvents(): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data ?? []
}

/**
 * One event by slug, or null if not found. Anon RLS restricts this to published rows, so an
 * unpublished or nonexistent slug resolves to null — the caller renders a clean not-found state
 * rather than silently falling back to another event.
 */
export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw error
  return (data as EventRow) ?? null
}

/**
 * The editable Mind · Body · Soul program copy (a single `site_settings` row, anon-readable).
 * Falls back to the default copy if the row is missing, so the public section never disappears.
 */
export async function getMindBodySoul(): Promise<MindBodySoulContent> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "mind_body_soul")
    .maybeSingle()

  if (error) throw error
  return (data?.value as MindBodySoulContent | undefined) ?? DEFAULT_MIND_BODY_SOUL
}
