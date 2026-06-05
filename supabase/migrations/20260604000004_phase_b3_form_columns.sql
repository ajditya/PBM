-- Phase B3 — Migration 4: dedicated columns for form fields that had no Phase A
-- home, plus storage-layer hardening of the private applications bucket.
-- Idempotent: safe to re-run.

-- ---------------------------------------------------------------------------
-- inquiries: contact-form subject + inquiry-dialog estimated dates
-- ---------------------------------------------------------------------------
alter table inquiries add column if not exists subject text;
alter table inquiries add column if not exists estimated_dates text;

-- ---------------------------------------------------------------------------
-- model_applications: measurement fields beyond the existing `height`
-- (city maps to the existing `location` column)
-- ---------------------------------------------------------------------------
alter table model_applications add column if not exists bust text;
alter table model_applications add column if not exists waist text;
alter table model_applications add column if not exists hips text;
alter table model_applications add column if not exists shoes text;
alter table model_applications add column if not exists hair text;
alter table model_applications add column if not exists eyes text;

-- ---------------------------------------------------------------------------
-- Harden the private `applications` bucket. The public client uploads applicant
-- photos via short-lived signed URLs (no anon storage policy exists), so we
-- constrain the actual bytes at the storage layer as defense in depth on top of
-- the Edge Function's metadata validation: images only, <= 10 MB each.
-- ---------------------------------------------------------------------------
update storage.buckets
  set file_size_limit = 10485760, -- 10 MB
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
  where id = 'applications';
