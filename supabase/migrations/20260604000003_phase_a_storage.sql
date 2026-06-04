-- Phase A — Migration 3: storage buckets + storage.objects policies
-- models/events/site = public read. applications = private (signed URLs only).

-- ---------------------------------------------------------------------------
-- Buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('models',       'models',       true),
  ('events',       'events',       true),
  ('site',         'site',         true),
  ('applications', 'applications', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Public read on the three public buckets (anon + authenticated)
-- ---------------------------------------------------------------------------
drop policy if exists storage_public_buckets_read on storage.objects;
create policy storage_public_buckets_read on storage.objects
  for select to public
  using (bucket_id in ('models', 'events', 'site'));

-- ---------------------------------------------------------------------------
-- Authenticated (admin) manage the three public buckets — covers/gallery/site
-- uploads. Sensible extension of "authenticated full read/write".
-- ---------------------------------------------------------------------------
drop policy if exists storage_public_buckets_auth_manage on storage.objects;
create policy storage_public_buckets_auth_manage on storage.objects
  for all to authenticated
  using (bucket_id in ('models', 'events', 'site'))
  with check (bucket_id in ('models', 'events', 'site'));

-- ---------------------------------------------------------------------------
-- applications bucket: PRIVATE — authenticated read + insert only.
-- No anon policy ever touches this bucket -> never publicly readable.
-- Admin access to applicant photos is via signed URLs (generated server-side).
-- ---------------------------------------------------------------------------
drop policy if exists storage_applications_auth_read on storage.objects;
create policy storage_applications_auth_read on storage.objects
  for select to authenticated
  using (bucket_id = 'applications');

drop policy if exists storage_applications_auth_insert on storage.objects;
create policy storage_applications_auth_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'applications');
