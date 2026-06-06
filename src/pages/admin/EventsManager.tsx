import { useCallback, useEffect, useState } from "react"

import {
  getAdminEvents,
  updateEvent,
  deleteEvent,
  demoteOtherFlagships,
  publicUrl,
  type EventRow,
  type EventUpdate,
} from "@/lib/supabase"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { formatEventDate } from "@/components/EventCard"
import EventEditor from "@/components/admin/EventEditor"
import EventCreate from "@/components/admin/EventCreate"
import MindBodySoulPanel from "@/components/admin/MindBodySoulPanel"

export default function EventsManager() {
  const { data, loading, error } = useAsyncData(() => getAdminEvents(), [])
  const [events, setEvents] = useState<EventRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (data) setEvents(data)
  }, [data])

  const refreshEvents = useCallback(async () => {
    try {
      setEvents(await getAdminEvents())
    } catch {
      /* keep current list */
    }
  }, [])

  async function handleSaveFields(id: string, fields: EventUpdate) {
    const prev = events
    const promoting = fields.type === "flagship"
    // Optimistic: apply this event's changes, and if it's becoming flagship, demote any other
    // flagship in the same pass so the list never shows two flagships mid-save.
    setEvents((list) =>
      list.map((e) => {
        if (e.id === id) return { ...e, ...fields }
        if (promoting && e.type === "flagship") return { ...e, type: "property" }
        return e
      }),
    )
    try {
      if (promoting) await demoteOtherFlagships(id)
      await updateEvent(id, fields)
    } catch (e) {
      setEvents(prev)
      throw e
    }
  }

  async function handleDeleteEvent(
    event: Pick<EventRow, "id" | "slug" | "cover_image" | "title">,
  ) {
    await deleteEvent(event)
    setEvents((list) => list.filter((e) => e.id !== event.id))
    setSelectedId(null)
    toast({ message: `Deleted ${event.title}.` })
  }

  const flagship = events.find((e) => e.type === "flagship") ?? null
  const currentFlagship = flagship
    ? { id: flagship.id, title: flagship.title }
    : null

  return (
    <div className="px-10 py-12">
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <p className="pbm-eyebrow mb-4">Events</p>
          <h1 className="pbm-display-s">Calendar</h1>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="pbm-bar mt-2 w-auto px-6"
        >
          New event →
        </button>
      </div>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load the calendar. Refresh to retry.
        </p>
      )}

      {!loading && !error && (
        <ul className="flex flex-col">
          {events.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setSelectedId(e.id)}
                className={cn(
                  "group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-hairline py-4 text-left transition-colors hover:bg-ink/[0.02]",
                  !e.published && "opacity-45",
                )}
              >
                <span className="h-16 w-12 shrink-0 overflow-hidden bg-ink/5">
                  {e.cover_image && (
                    <img
                      src={publicUrl(e.cover_image)}
                      alt=""
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>

                <span className="min-w-0">
                  <span className="pbm-meta-value block truncate">{e.title}</span>
                  <span className="pbm-meta-label mt-1 block truncate normal-case tracking-normal text-mute">
                    {formatEventDate(e.event_date) || "—"} · {e.location ?? "—"}
                  </span>
                </span>

                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "border px-2 py-1 text-[0.625rem] uppercase tracking-[0.2em]",
                      e.type === "flagship"
                        ? "border-gold text-ink"
                        : "border-hairline text-mute",
                    )}
                  >
                    {e.type === "flagship" ? "Flagship" : "Property"}
                  </span>
                  <span
                    className={cn(
                      "border px-2 py-1 text-[0.625rem] uppercase tracking-[0.2em]",
                      e.published
                        ? "border-hairline text-mute"
                        : "border-error/50 text-error",
                    )}
                  >
                    {e.published ? "Published" : "Draft"}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Mind · Body · Soul — program content, not an event */}
      <MindBodySoulPanel />

      {/* Edit drawer */}
      <Sheet
        open={selectedId !== null}
        onOpenChange={(o) => {
          if (!o) setSelectedId(null)
        }}
      >
        <SheetContent side="right" className="w-full bg-paper text-ink sm:max-w-xl">
          <SheetTitle className="sr-only">Edit event</SheetTitle>
          {selectedId && (
            <EventEditor
              key={selectedId}
              eventId={selectedId}
              currentFlagship={currentFlagship}
              onSaveFields={handleSaveFields}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Create drawer */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="right" className="w-full bg-paper text-ink sm:max-w-xl">
          <SheetTitle className="sr-only">New event</SheetTitle>
          {createOpen && (
            <EventCreate
              currentFlagship={currentFlagship}
              onDone={() => {
                setCreateOpen(false)
                refreshEvents()
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
