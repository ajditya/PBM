-- Phase A — Migration 1: schema (enums, tables, indexes, seed)
-- Prasad Bidapa site. Reproducible foundation. No data migration, no UI.

-- ---------------------------------------------------------------------------
-- Enums (guarded so the migration is safe to re-run)
-- ---------------------------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'model_gender') then
    create type model_gender as enum ('female', 'male');
  end if;
  if not exists (select 1 from pg_type where typname = 'event_type') then
    create type event_type as enum ('flagship', 'property');
  end if;
  if not exists (select 1 from pg_type where typname = 'inquiry_status') then
    create type inquiry_status as enum ('new', 'read', 'contacted');
  end if;
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type application_status as enum ('new', 'reviewing', 'shortlisted', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'application_gender') then
    create type application_gender as enum ('female', 'male', 'other');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists models (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  gender      model_gender not null,
  cover_image text,
  height      text,
  bust        text,
  waist       text,
  hips        text,
  shoes       text,
  hair        text,
  eyes        text,
  location    text,
  board       text,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists model_gallery (
  id         uuid primary key default gen_random_uuid(),
  model_id   uuid not null references models(id) on delete cascade,
  image_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  type        event_type not null,
  event_date  date,
  location    text,
  cover_image text,
  description text,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  company    text,
  model_id   uuid references models(id) on delete set null,
  message    text not null,
  status     inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists model_applications (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null,
  age         integer,
  gender      application_gender not null,
  height      text,
  location    text,
  instagram   text,
  photo_paths jsonb not null default '[]'::jsonb,
  message     text,
  status      application_status not null default 'new',
  created_at  timestamptz not null default now()
);

create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (slug uniques are auto-indexed by their unique constraints)
-- ---------------------------------------------------------------------------
create index if not exists model_gallery_model_id_idx on model_gallery (model_id);
create index if not exists inquiries_model_id_idx      on inquiries (model_id);
create index if not exists models_published_idx        on models (published);
create index if not exists events_published_idx        on events (published);

-- ---------------------------------------------------------------------------
-- Seed: site_settings
-- ---------------------------------------------------------------------------
insert into site_settings (key, value) values
  ('hero_video',  '{"url": ""}'::jsonb),
  ('hero_poster', '{"url": ""}'::jsonb)
on conflict (key) do nothing;
