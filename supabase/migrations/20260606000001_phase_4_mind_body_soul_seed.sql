-- ---------------------------------------------------------------------------
-- Phase 4 — Seed the editable Mind · Body · Soul program content.
--
-- The MBS band on the public Events page was previously hardcoded JSX. It now
-- reads from this single site_settings row. Seed it with the exact original
-- copy so the section is byte-identical on first deploy. Idempotent — the
-- on-conflict guard means re-running never clobbers admin edits.
-- ---------------------------------------------------------------------------
insert into site_settings (key, value) values
  (
    'mind_body_soul',
    $json$
    {
      "eyebrow": "A Prasad Bidapa Models Program",
      "heading": "Mind · Body · Soul.",
      "description": "A comprehensive training and grooming program created to shape confident, polished, industry-ready individuals for fashion, media, and public presence. Built on complete personal development, it focuses on confidence building, personality enhancement, fitness, communication skills, etiquette, runway training, and overall presentation.",
      "pillars": [
        {
          "label": "Mind",
          "blurb": "Confidence building, personality enhancement and communication skills — the inner work that carries a face through any room."
        },
        {
          "label": "Body",
          "blurb": "Fitness and runway training that translate presence into movement, posture and a sure command of the stage."
        },
        {
          "label": "Soul",
          "blurb": "Etiquette, poise and overall presentation — the finish that turns raw potential into a polished, industry-ready professional."
        }
      ],
      "cta_label": "Enquire about training",
      "cta_href": "/become-a-model"
    }
    $json$::jsonb
  )
on conflict (key) do nothing;
