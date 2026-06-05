import { useEffect, useState } from "react"

import {
  getApplications,
  getInquiries,
  applicationPhotoPaths,
  updateApplicationStatus,
  updateInquiryStatus,
  type ApplicationRow,
  type ApplicationStatus,
  type InquiryStatus,
  type InquiryWithModel,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import StatusPill from "@/components/admin/StatusPill"
import InquiryDetail from "@/components/admin/InquiryDetail"
import ApplicationDetail from "@/components/admin/ApplicationDetail"

type Tab = "inquiries" | "applications"
type Selected = { kind: "inquiry" | "application"; id: string } | null

const fmtShort = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))

export default function Inbox() {
  const [tab, setTab] = useState<Tab>("inquiries")
  const [selected, setSelected] = useState<Selected>(null)

  // Initial load via useAsyncData; mirror into local state so status changes can
  // update optimistically (and revert on error) without a refetch.
  const { data, loading, error } = useAsyncData(async () => {
    const [inquiries, applications] = await Promise.all([
      getInquiries(),
      getApplications(),
    ])
    return { inquiries, applications }
  }, [])

  const [inquiries, setInquiries] = useState<InquiryWithModel[]>([])
  const [applications, setApplications] = useState<ApplicationRow[]>([])

  useEffect(() => {
    if (data) {
      setInquiries(data.inquiries)
      setApplications(data.applications)
    }
  }, [data])

  // Counts derive from live local state, so a row leaving `new` drops the badge.
  const newInquiries = inquiries.filter((i) => i.status === "new").length
  const newApplications = applications.filter((a) => a.status === "new").length

  // Detail rows are looked up from live state by id, so the open drawer always
  // reflects the current (optimistic) status.
  const selectedInquiry =
    selected?.kind === "inquiry"
      ? inquiries.find((i) => i.id === selected.id) ?? null
      : null
  const selectedApplication =
    selected?.kind === "application"
      ? applications.find((a) => a.id === selected.id) ?? null
      : null

  async function changeInquiryStatus(id: string, next: InquiryStatus) {
    const prev = inquiries.find((i) => i.id === id)?.status
    if (!prev || prev === next) return
    setInquiries((list) =>
      list.map((i) => (i.id === id ? { ...i, status: next } : i)),
    )
    try {
      await updateInquiryStatus(id, next)
    } catch {
      setInquiries((list) =>
        list.map((i) => (i.id === id ? { ...i, status: prev } : i)),
      )
      toast({ variant: "error", message: "Couldn't update status. Try again." })
    }
  }

  async function changeApplicationStatus(id: string, next: ApplicationStatus) {
    const prev = applications.find((a) => a.id === id)?.status
    if (!prev || prev === next) return
    setApplications((list) =>
      list.map((a) => (a.id === id ? { ...a, status: next } : a)),
    )
    try {
      await updateApplicationStatus(id, next)
    } catch {
      setApplications((list) =>
        list.map((a) => (a.id === id ? { ...a, status: prev } : a)),
      )
      toast({ variant: "error", message: "Couldn't update status. Try again." })
    }
  }

  return (
    <div className="px-10 py-12">
      <p className="pbm-eyebrow mb-4">Inbox</p>
      <h1 className="pbm-display-s mb-10">Messages</h1>

      {/* Segmented control */}
      <div className="mb-10 flex gap-8 border-b border-hairline">
        <TabButton
          active={tab === "inquiries"}
          count={newInquiries}
          onClick={() => setTab("inquiries")}
        >
          Inquiries
        </TabButton>
        <TabButton
          active={tab === "applications"}
          count={newApplications}
          onClick={() => setTab("applications")}
        >
          Applications
        </TabButton>
      </div>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load the inbox. Refresh to retry.
        </p>
      )}

      {!loading && !error && tab === "inquiries" && (
        <InquiriesList
          rows={inquiries}
          onSelect={(row) => setSelected({ kind: "inquiry", id: row.id })}
        />
      )}
      {!loading && !error && tab === "applications" && (
        <ApplicationsList
          rows={applications}
          onSelect={(row) => setSelected({ kind: "application", id: row.id })}
        />
      )}

      {/* Detail drawer */}
      <Sheet open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full bg-paper text-ink sm:max-w-xl">
          {/* Title is required for a11y; visually it lives inside the detail. */}
          <SheetTitle className="sr-only">
            {selectedInquiry
              ? `Inquiry from ${selectedInquiry.name}`
              : selectedApplication
                ? `Application from ${selectedApplication.name}`
                : "Detail"}
          </SheetTitle>
          {selectedInquiry && (
            <InquiryDetail
              inquiry={selectedInquiry}
              onStatusChange={(next) =>
                changeInquiryStatus(selectedInquiry.id, next)
              }
            />
          )}
          {selectedApplication && (
            <ApplicationDetail
              row={selectedApplication}
              onStatusChange={(next) =>
                changeApplicationStatus(selectedApplication.id, next)
              }
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function TabButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean
  count: number
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pbm-ui -mb-px flex items-center gap-2 border-b-2 pb-4 text-[0.75rem] transition-colors",
        active ? "border-gold text-ink" : "border-transparent text-mute hover:text-ink",
      )}
    >
      {children}
      {count > 0 && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[0.625rem] font-medium tracking-normal text-ink">
          {count}
        </span>
      )}
    </button>
  )
}

function EmptyRow({ label }: { label: string }) {
  return <p className="pbm-body text-mute">{label}</p>
}

function InquiriesList({
  rows,
  onSelect,
}: {
  rows: InquiryWithModel[]
  onSelect: (row: InquiryWithModel) => void
}) {
  if (rows.length === 0) return <EmptyRow label="No inquiries yet." />
  return (
    <ul className="flex flex-col">
      {rows.map((row) => {
        const secondary = row.model ? `re: ${row.model.name}` : row.subject ?? "—"
        return (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onSelect(row)}
              className={cn(
                "group grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-hairline py-5 pl-4 text-left transition-colors hover:bg-ink/[0.02]",
                row.status === "new"
                  ? "border-l-2 border-l-gold"
                  : "border-l-2 border-l-transparent",
              )}
            >
              <span className="min-w-0">
                <span className="pbm-meta-value block truncate">{row.name}</span>
                <span className="pbm-meta-label mt-1 block truncate normal-case tracking-normal text-mute">
                  {secondary} · {row.email}
                </span>
              </span>
              <span className="flex items-center gap-5">
                <span className="pbm-meta-label hidden sm:block">
                  {fmtShort(row.created_at)}
                </span>
                <StatusPill status={row.status} />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function ApplicationsList({
  rows,
  onSelect,
}: {
  rows: ApplicationRow[]
  onSelect: (row: ApplicationRow) => void
}) {
  if (rows.length === 0) return <EmptyRow label="No applications yet." />
  return (
    <ul className="flex flex-col">
      {rows.map((row) => {
        const count = applicationPhotoPaths(row).length
        const place = [row.gender, row.location].filter(Boolean).join(" · ")
        return (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onSelect(row)}
              className={cn(
                "group grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-hairline py-5 pl-4 text-left transition-colors hover:bg-ink/[0.02]",
                row.status === "new"
                  ? "border-l-2 border-l-gold"
                  : "border-l-2 border-l-transparent",
              )}
            >
              <span className="min-w-0">
                <span className="pbm-meta-value block truncate">{row.name}</span>
                <span className="pbm-meta-label mt-1 block truncate normal-case tracking-normal text-mute">
                  {place || "—"} · {count} photo{count === 1 ? "" : "s"}
                </span>
              </span>
              <span className="flex items-center gap-5">
                <span className="pbm-meta-label hidden sm:block">
                  {fmtShort(row.created_at)}
                </span>
                <StatusPill status={row.status} />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
