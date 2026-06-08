import { useEffect, useRef, useState } from "react"

import {
  getSiteContent,
  setSiteSetting,
  deleteTeamMemberImage,
  setTeamMemberImage,
  type Json,
} from "@/lib/supabase"
import {
  DEFAULT_TEAM_MEMBERS,
  teamImageSrc,
  type TeamMemberContent,
} from "@/lib/team-members"
import { useAsyncData } from "@/hooks/useAsyncData"
import { toast } from "@/hooks/useToast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  compressAndUpload,
  UploadButton,
  UploadList,
  type UploadItem,
} from "@/components/admin/uploads"

/* ────────────────────────────────────────────────────────────
 * Admin — Team manager. Edits the `team_members` site_settings row:
 * edit name/role/bio, replace photo, add/remove, reorder. Photos
 * upload to site/team/{id}.webp immediately; the row (order + text +
 * photo references) persists on Save. On Save, storage objects for
 * removed members are swept.
 * ──────────────────────────────────────────────────────────── */

export default function TeamManager() {
  const { data, loading, error } = useAsyncData(
    () => getSiteContent("team_members", DEFAULT_TEAM_MEMBERS),
    [],
  )
  const [members, setMembers] = useState<TeamMemberContent[] | null>(null)
  // Snapshot of last-persisted members, to sweep storage for removed ones on save.
  const loadedRef = useRef<TeamMemberContent[]>([])
  const [saving, setSaving] = useState(false)
  const [uploads, setUploads] = useState<Record<string, UploadItem | undefined>>({})

  useEffect(() => {
    if (data) {
      setMembers(data.members)
      loadedRef.current = data.members
    }
  }, [data])

  function setMember(id: string, patch: Partial<TeamMemberContent>) {
    setMembers((list) =>
      list ? list.map((m) => (m.id === id ? { ...m, ...patch } : m)) : list,
    )
  }

  function addMember() {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `member-${Date.now()}`
    setMembers((list) => [
      ...(list ?? []),
      { id, name: "", role: "", bio: "", img: "" },
    ])
  }

  function removeMember(id: string) {
    setMembers((list) => (list ? list.filter((m) => m.id !== id) : list))
  }

  function move(id: string, dir: -1 | 1) {
    setMembers((list) => {
      if (!list) return list
      const i = list.findIndex((m) => m.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= list.length) return list
      const next = [...list]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  async function handlePhoto(id: string, file: File) {
    setUploads((u) => ({
      ...u,
      [id]: { key: id, name: file.name, status: "queued" },
    }))
    const ok = await compressAndUpload(
      file,
      async (webp) => {
        const path = await setTeamMemberImage(id, webp)
        setMember(id, { img: path, v: Date.now() })
      },
      (patch) =>
        setUploads((u) => ({
          ...u,
          [id]: u[id] ? { ...u[id]!, ...patch } : (patch as UploadItem),
        })),
    )
    toast(
      ok
        ? { message: "Photo uploaded. Save to publish." }
        : { variant: "error", message: "Couldn't upload the photo." },
    )
  }

  async function save() {
    if (!members || saving) return
    setSaving(true)
    try {
      await setSiteSetting("team_members", { members } as unknown as Json)
      // Sweep storage for members removed since last load (best-effort).
      const presentIds = new Set(members.map((m) => m.id))
      const removed = loadedRef.current.filter((m) => !presentIds.has(m.id))
      await Promise.all(removed.map((m) => deleteTeamMemberImage(m.img)))
      loadedRef.current = members
      toast({ message: "Team saved." })
    } catch {
      toast({ variant: "error", message: "Couldn't save the team. Try again." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-10 py-12 max-w-3xl">
      <p className="pbm-eyebrow mb-4">Team</p>
      <h1 className="pbm-display-s mb-2">Team members</h1>
      <p className="pbm-meta-label mb-10 normal-case tracking-normal text-mute">
        The team grid on the About page. Edit details, replace photos, reorder,
        and add or remove members. Photos upload immediately; changes publish
        when you Save.
      </p>

      {loading && <p className="pbm-body text-mute">Loading…</p>}
      {error && (
        <p className="text-error text-[0.8125rem] tracking-[0.02em]">
          Couldn't load the team. Refresh to retry.
        </p>
      )}

      {!loading && !error && members && (
        <div>
          <div className="flex flex-col gap-12">
            {members.map((m, i) => (
              <div
                key={m.id}
                className="grid grid-cols-[auto_1fr] items-start gap-6 border-b border-hairline pb-10"
              >
                {/* Photo */}
                <div className="flex w-24 flex-col gap-3">
                  <span className="h-28 w-24 overflow-hidden bg-ink/5">
                    {teamImageSrc(m) ? (
                      <img
                        src={teamImageSrc(m)}
                        alt=""
                        draggable={false}
                        className="h-full w-full object-cover grayscale"
                      />
                    ) : null}
                  </span>
                  <UploadButton
                    busy={saving}
                    accept="image/*"
                    label={m.img ? "Replace" : "Upload"}
                    onFile={(f) => handlePhoto(m.id, f)}
                  />
                  {uploads[m.id] && <UploadList items={[uploads[m.id]!]} />}
                </div>

                {/* Fields */}
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="pbm-meta-label mb-2">Name</label>
                    <Input
                      value={m.name}
                      onChange={(e) => setMember(m.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="pbm-meta-label mb-2">
                      Role / credential
                    </label>
                    <Input
                      value={m.role}
                      onChange={(e) => setMember(m.id, { role: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="pbm-meta-label mb-2">Bio</label>
                    <Textarea
                      className="min-h-[6rem]"
                      value={m.bio}
                      onChange={(e) => setMember(m.id, { bio: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => move(m.id, -1)}
                      disabled={i === 0}
                      className="pbm-link text-mute disabled:opacity-30"
                    >
                      ↑ Up
                    </button>
                    <button
                      type="button"
                      onClick={() => move(m.id, 1)}
                      disabled={i === members.length - 1}
                      className="pbm-link text-mute disabled:opacity-30"
                    >
                      ↓ Down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMember(m.id)}
                      className="pbm-link text-error"
                    >
                      Remove member
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-8">
            <button
              type="button"
              onClick={addMember}
              className="pbm-link text-ink"
            >
              + Add member
            </button>
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="pbm-bar mt-10 w-auto px-6 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save team →"}
          </button>
        </div>
      )}
    </div>
  )
}
