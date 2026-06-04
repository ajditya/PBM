-- Phase A — Migration 2: Row Level Security (enable + policies)
-- Relies on Supabase default role grants (anon/authenticated get table privileges
-- on new public tables); RLS is what actually gates access.

-- ---------------------------------------------------------------------------
-- Enable RLS on every table
-- ---------------------------------------------------------------------------
alter table models             enable row level security;
alter table model_gallery      enable row level security;
alter table events             enable row level security;
alter table inquiries          enable row level security;
alter table model_applications enable row level security;
alter table site_settings      enable row level security;

-- ---------------------------------------------------------------------------
-- models: anon reads published; authenticated full access
-- ---------------------------------------------------------------------------
drop policy if exists models_anon_select on models;
create policy models_anon_select on models
  for select to anon
  using (published = true);

drop policy if exists models_auth_all on models;
create policy models_auth_all on models
  for all to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- model_gallery: anon reads only galleries of published models
-- ---------------------------------------------------------------------------
drop policy if exists model_gallery_anon_select on model_gallery;
create policy model_gallery_anon_select on model_gallery
  for select to anon
  using (exists (
    select 1 from models m
    where m.id = model_gallery.model_id and m.published = true
  ));

drop policy if exists model_gallery_auth_all on model_gallery;
create policy model_gallery_auth_all on model_gallery
  for all to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- events: anon reads published; authenticated full access
-- ---------------------------------------------------------------------------
drop policy if exists events_anon_select on events;
create policy events_anon_select on events
  for select to anon
  using (published = true);

drop policy if exists events_auth_all on events;
create policy events_auth_all on events
  for all to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- site_settings: anon reads all; authenticated full access
-- ---------------------------------------------------------------------------
drop policy if exists site_settings_anon_select on site_settings;
create policy site_settings_anon_select on site_settings
  for select to anon
  using (true);

drop policy if exists site_settings_auth_all on site_settings;
create policy site_settings_auth_all on site_settings
  for all to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- inquiries: anon may insert only (no select/update/delete); auth full access
-- ---------------------------------------------------------------------------
drop policy if exists inquiries_anon_insert on inquiries;
create policy inquiries_anon_insert on inquiries
  for insert to anon
  with check (true);

drop policy if exists inquiries_auth_all on inquiries;
create policy inquiries_auth_all on inquiries
  for all to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- model_applications: anon may insert only; auth full access
-- ---------------------------------------------------------------------------
drop policy if exists model_applications_anon_insert on model_applications;
create policy model_applications_anon_insert on model_applications
  for insert to anon
  with check (true);

drop policy if exists model_applications_auth_all on model_applications;
create policy model_applications_auth_all on model_applications
  for all to authenticated
  using (true) with check (true);
