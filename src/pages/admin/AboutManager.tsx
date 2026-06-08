import { DEFAULT_ABOUT_COPY, type AboutCopy } from "@/lib/about-copy"
import { useContentEditor } from "@/components/admin/useContentEditor"
import {
  AreaField,
  Field,
  FieldGroup,
  ParagraphsField,
  SaveBar,
} from "@/components/admin/content-fields"

/* ────────────────────────────────────────────────────────────
 * Admin — About page copy editor. Edits the `about_copy`
 * site_settings row (headlines + body text). The photo trios and
 * founder portrait are managed in Media; the team grid in Team.
 * ──────────────────────────────────────────────────────────── */

export default function AboutManager() {
  const { form, setForm, loading, error, saving, save } = useContentEditor(
    "about_copy",
    DEFAULT_ABOUT_COPY,
  )

  function patch<K extends keyof AboutCopy>(section: K, value: AboutCopy[K]) {
    setForm((f) => (f ? { ...f, [section]: value } : f))
  }

  return (
    <div className="px-10 py-12 max-w-2xl">
      <p className="pbm-eyebrow mb-4">About</p>
      <h1 className="pbm-display-s mb-2">About page copy</h1>
      <p className="pbm-meta-label mb-10 normal-case tracking-normal text-mute">
        Headlines and body text for the About page. Photos are managed under
        Media; team members under Team.
      </p>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load the About copy. Refresh to retry.
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
            <AreaField
              label="Manifesto"
              minHeight="7rem"
              value={form.hero.manifesto}
              onChange={(v) => patch("hero", { ...form.hero, manifesto: v })}
            />
          </FieldGroup>

          <FieldGroup title="The Models">
            <Field
              label="Heading"
              value={form.models.heading}
              onChange={(v) => patch("models", { ...form.models, heading: v })}
            />
            <ParagraphsField
              label="Body paragraphs"
              value={form.models.body}
              onChange={(v) => patch("models", { ...form.models, body: v })}
            />
          </FieldGroup>

          <FieldGroup title="The Associates">
            <Field
              label="Heading"
              value={form.associates.heading}
              onChange={(v) =>
                patch("associates", { ...form.associates, heading: v })
              }
            />
            <ParagraphsField
              label="Body paragraphs"
              value={form.associates.body}
              onChange={(v) =>
                patch("associates", { ...form.associates, body: v })
              }
            />
          </FieldGroup>

          <FieldGroup title="The Founder">
            <Field
              label="Heading"
              value={form.founder.heading}
              onChange={(v) => patch("founder", { ...form.founder, heading: v })}
            />
            <ParagraphsField
              label="Biography paragraphs"
              value={form.founder.bio}
              onChange={(v) => patch("founder", { ...form.founder, bio: v })}
            />
            <Field
              label="Pull quote"
              value={form.founder.quote}
              onChange={(v) => patch("founder", { ...form.founder, quote: v })}
            />
          </FieldGroup>

          <FieldGroup title="The Team (header)">
            <Field
              label="Heading"
              value={form.team.heading}
              onChange={(v) => patch("team", { ...form.team, heading: v })}
            />
            <AreaField
              label="Description"
              value={form.team.description}
              onChange={(v) => patch("team", { ...form.team, description: v })}
            />
          </FieldGroup>

          <SaveBar saving={saving} onSave={save} label="Save About copy →" />
        </div>
      )}
    </div>
  )
}
