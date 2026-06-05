import type { InquiryStatus, InquiryWithModel } from "@/lib/supabase"
import StatusPill from "@/components/admin/StatusPill"
import StatusControl from "@/components/admin/StatusControl"

const INQUIRY_STATUSES: readonly InquiryStatus[] = ["new", "read", "contacted"]

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1 border-b border-hairline pb-3">
      <dt className="pbm-meta-label">{label}</dt>
      <dd className="pbm-meta-value whitespace-pre-wrap break-words">{value}</dd>
    </div>
  )
}

export default function InquiryDetail({
  inquiry,
  onStatusChange,
}: {
  inquiry: InquiryWithModel
  onStatusChange: (next: InquiryStatus) => Promise<void>
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 py-10">
      <p className="pbm-eyebrow-mute mb-4">Inquiry</p>
      <div className="mb-2 flex items-start justify-between gap-4">
        <h2 className="pbm-display-xs">{inquiry.name}</h2>
        <StatusPill status={inquiry.status} className="mt-1 shrink-0" />
      </div>
      {inquiry.model && (
        <p className="pbm-quote mb-8 text-[1.25rem]">re: {inquiry.model.name}</p>
      )}

      <div className="mt-6 border-t border-hairline pt-6">
        <StatusControl
          value={inquiry.status}
          options={INQUIRY_STATUSES}
          onChange={onStatusChange}
        />
      </div>

      <dl className="mt-8 flex flex-col gap-5">
        <Field label="Email" value={inquiry.email} />
        <Field label="Phone" value={inquiry.phone} />
        <Field label="Company" value={inquiry.company} />
        <Field label="Subject" value={inquiry.subject} />
        <Field label="Estimated dates" value={inquiry.estimated_dates} />
        <Field label="Message" value={inquiry.message} />
        <Field label="Received" value={fmtDate(inquiry.created_at)} />
      </dl>
    </div>
  )
}
