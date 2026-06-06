-- ---------------------------------------------------------------------------
-- Phase B — Media manager: seed empty site_settings rows for the About media
-- slots.
--
-- Empty defaults mean the public read resolves to "" and each consumer falls
-- back to its placeholder-assets constant — zero visual regression until an
-- admin uploads. hero_video / hero_poster were seeded in phase A.
--
-- Single image  → {"url": ""}     Ordered image set → {"urls": []}
-- Idempotent: the on-conflict guard never clobbers admin edits on re-run.
-- ---------------------------------------------------------------------------
insert into site_settings (key, value) values
  ('founder_portrait',        '{"url": ""}'::jsonb),
  ('about_associates_photos', '{"urls": []}'::jsonb),
  ('about_models_photos',     '{"urls": []}'::jsonb)
on conflict (key) do nothing;
