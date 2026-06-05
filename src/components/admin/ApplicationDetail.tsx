import {
  applicationPhotoPaths,
  signApplicationPhotos,
  type ApplicationRow,
  type ApplicationStatus,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import StatusPill from "@/components/admin/StatusPill"
import StatusControl from "@/components/admin/StatusControl"

const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "archived",
]

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))

const MEASUREMENTS: ReadonlyArray<{ label: string; key: keyof ApplicationRow }> = [
  { label: "Height", key: "height" },
  { label: "Bust", key: "bust" },
  { label: "Waist", key: "waist" },
  { label: "Hips", key: "hips" },
  { label: "Shoes", key: "shoes" },
  { label: "Hair", key: "hair" },
  { label: "Eyes", key: "eyes" },
  { label: "Age", key: "age" },
]

function Field({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className="flex flex-col gap-1 border-b border-hairline pb-3">
      <dt className="pbm-meta-label">{label}</dt>
      <dd className="pbm-meta-value whitespace-pre-wrap break-words">{value}</dd>
    </div>
  )
}

/**
 * Applicant photo gallery.
 *
 * SENSITIVE: these images live in the PRIVATE `applications` bucket and depict
 * real applicants (often minors-adjacent). They render ONLY through fresh,
 * short-lived signed URLs minted via the authenticated session
 * (signApplicationPhotos → createSignedUrls). The URLs are held in component
 * state for this render only — never cached, persisted, or logged — and a
 * public URL must never be constructed for this bucket.
 */
function PhotoGallery({ row }: { row: ApplicationRow }) {
  const paths = applicationPhotoPaths(row)
  const { data: photos, loading, error } = useAsyncData(
    () => signApplicationPhotos(paths),
    [row.id],
  )

  if (paths.length === 0) {
    return <p className="pbm-body text-mute">No photos submitted.</p>
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {paths.map((p) => (
          <div key={p} className="aspect-[4/5] animate-pulse bg-ink/5" />
        ))}
      </div>
    )
  }

  if (error || !photos) {
    return (
      <p className="text-error text-[0.8125rem] tracking-[0.02em]">
        Couldn't load the photos. Close and reopen to retry.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo, i) =>
        photo.url ? (
          <a
            key={photo.path}
            href={photo.url}
            target="_blank"
            rel="noreferrer"
            className="block aspect-[4/5] overflow-hidden bg-ink/5"
          >
            <img
              src={photo.url}
              alt={`${row.name} — photo ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </a>
        ) : (
          <div
            key={photo.path}
            className="flex aspect-[4/5] items-center justify-center bg-ink/5 px-2 text-center"
          >
            <span className="pbm-meta-label">Unavailable</span>
          </div>
        ),
      )}
    </div>
  )
}

export default function ApplicationDetail({
  row,
  onStatusChange,
}: {
  row: ApplicationRow
  onStatusChange: (next: ApplicationStatus) => Promise<void>
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 py-10">
      <p className="pbm-eyebrow-mute mb-4">Application</p>
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 className="pbm-display-xs">{row.name}</h2>
        <StatusPill status={row.status} className="mt-1 shrink-0" />
      </div>

      <div className="mb-8 border-t border-hairline pt-6">
        <StatusControl
          value={row.status}
          options={APPLICATION_STATUSES}
          onChange={onStatusChange}
        />
      </div>

      {/* Contact */}
      <dl className="flex flex-col gap-5">
        <Field label="Email" value={row.email} />
        <Field label="Phone" value={row.phone} />
        <Field label="Instagram" value={row.instagram} />
        <Field label="Location" value={row.location} />
        <Field label="Gender" value={row.gender} />
        <Field label="Received" value={fmtDate(row.created_at)} />
      </dl>

      {/* Measurements — mirrors the model-detail stats block */}
      <p className="pbm-eyebrow-mute mt-10 mb-4">Measurements</p>
      <dl className="grid grid-cols-2 gap-x-10 gap-y-4">
        {MEASUREMENTS.map(({ label, key }) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3"
          >
            <dt className="pbm-meta-label">{label}</dt>
            <dd className="pbm-meta-value">{(row[key] as string | number | null) ?? "—"}</dd>
          </div>
        ))}
      </dl>

      {row.message && (
        <>
          <p className="pbm-eyebrow-mute mt-10 mb-4">Message</p>
          <p className="pbm-body whitespace-pre-wrap break-words">{row.message}</p>
        </>
      )}

      {/* Photos — private, signed-URL only */}
      <div className="mt-10 mb-4 flex items-center justify-between">
        <p className="pbm-eyebrow-mute">Photos</p>
        <span className="pbm-meta-label">Private · admin only</span>
      </div>
      <PhotoGallery row={row} />
    </div>
  )
}
