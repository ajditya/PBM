import { DEFAULT_HOME_COPY, type HomeCopy } from "@/lib/home-copy"
import { useContentEditor } from "@/components/admin/useContentEditor"
import {
  AreaField,
  Field,
  FieldGroup,
  ParagraphsField,
  SaveBar,
} from "@/components/admin/content-fields"

/* ────────────────────────────────────────────────────────────
 * Admin — Homepage copy editor. Edits the `home_copy` site_settings
 * row (headlines + body text). Images/video are managed in Media.
 * Headlines accept line breaks (one line per row in the textarea).
 * ──────────────────────────────────────────────────────────── */

export default function HomeManager() {
  const { form, setForm, loading, error, saving, save } = useContentEditor(
    "home_copy",
    DEFAULT_HOME_COPY,
  )

  function patch<K extends keyof HomeCopy>(section: K, value: HomeCopy[K]) {
    setForm((f) => (f ? { ...f, [section]: value } : f))
  }

  return (
    <div className="px-10 py-12 max-w-2xl">
      <p className="pbm-eyebrow mb-4">Homepage</p>
      <h1 className="pbm-display-s mb-2">Homepage copy</h1>
      <p className="pbm-meta-label mb-10 normal-case tracking-normal text-mute">
        Headlines and body text for the homepage sections. Images and the hero
        video are managed under Media.
      </p>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load the homepage copy. Refresh to retry.
        </p>
      )}

      {!loading && !error && form && (
        <div>
          <FieldGroup title="Hero">
            <AreaField
              label="Headline"
              hint="Each line becomes a new line on the page."
              value={form.hero.headline}
              onChange={(v) => patch("hero", { ...form.hero, headline: v })}
            />
          </FieldGroup>

          <FieldGroup title="The Mentor (About band)">
            <AreaField
              label="Heading"
              hint="Each line becomes a new line on the page."
              value={form.about.heading}
              onChange={(v) => patch("about", { ...form.about, heading: v })}
            />
            <Field
              label="Subheading"
              value={form.about.subhead}
              onChange={(v) => patch("about", { ...form.about, subhead: v })}
            />
            <ParagraphsField
              label="Body paragraphs"
              value={form.about.body}
              onChange={(v) => patch("about", { ...form.about, body: v })}
            />
            <Field
              label="Pull quote"
              value={form.about.quote}
              onChange={(v) => patch("about", { ...form.about, quote: v })}
            />
          </FieldGroup>

          <FieldGroup title="Models teaser">
            <AreaField
              label="Heading"
              hint="Each line becomes a new line on the page."
              value={form.modelsTeaser.heading}
              onChange={(v) =>
                patch("modelsTeaser", { ...form.modelsTeaser, heading: v })
              }
            />
            <AreaField
              label="Body"
              minHeight="8rem"
              value={form.modelsTeaser.body}
              onChange={(v) =>
                patch("modelsTeaser", { ...form.modelsTeaser, body: v })
              }
            />
          </FieldGroup>

          <FieldGroup title="Associates teaser">
            <AreaField
              label="Heading"
              hint="Each line becomes a new line on the page."
              value={form.associatesTeaser.heading}
              onChange={(v) =>
                patch("associatesTeaser", {
                  ...form.associatesTeaser,
                  heading: v,
                })
              }
            />
            <AreaField
              label="Body"
              minHeight="8rem"
              value={form.associatesTeaser.body}
              onChange={(v) =>
                patch("associatesTeaser", { ...form.associatesTeaser, body: v })
              }
            />
          </FieldGroup>

          <FieldGroup title="Events rail">
            <Field
              label="Heading"
              value={form.eventsScroll.heading}
              onChange={(v) =>
                patch("eventsScroll", { ...form.eventsScroll, heading: v })
              }
            />
          </FieldGroup>

          <SaveBar saving={saving} onSave={save} label="Save homepage copy →" />
        </div>
      )}
    </div>
  )
}
