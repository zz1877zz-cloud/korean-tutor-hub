"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl"

type Msg = {
  id: string
  sender_id: string
  body: string
  created_at: string
}

export default function ConsultationThread({
  consultationId,
  studentId,
  canSend,
}: {
  consultationId: string
  studentId: string
  canSend: boolean
}) {
  const t = useTranslations("ojakgyo")
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [rows, setRows] = useState<Msg[]>([])
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from("consultation_messages")
      .select("id, sender_id, body, created_at")
      .eq("consultation_id", consultationId)
      .order("created_at", { ascending: true })
    setRows((data as Msg[]) ?? [])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
    void load()
  }, [consultationId])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !body.trim()) return
    setLoading(true)
    setError(null)
    const { error: insertError } = await supabase.from("consultation_messages").insert({
      consultation_id: consultationId,
      sender_id: userId,
      body: body.trim(),
    })
    setLoading(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setBody("")
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="text-sm text-zinc-500">{t("threadEmpty")}</p>
        )}
        {rows.map((row) => {
          const mine = row.sender_id === userId
          const isStudent = row.sender_id === studentId
          return (
            <div
              key={row.id}
              className={`rounded-2xl border px-4 py-3 ${
                mine
                  ? "border-fuchsia-500/30 bg-fuchsia-500/10 ml-8"
                  : "border-white/10 bg-white/5 mr-8"
              }`}
            >
              <p className="text-[11px] text-zinc-500 mb-1">
                {isStudent ? t("roleStudent") : t("roleTutor")}
              </p>
              <p className="text-sm text-zinc-200 whitespace-pre-line">{row.body}</p>
            </div>
          )
        })}
      </div>

      {canSend ? (
        <form onSubmit={send} className="space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder={t("threadPlaceholder")}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          />
          <button
            type="submit"
            disabled={loading || !body.trim()}
            className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? t("sending") : t("threadSend")}
          </button>
          {error && <p className="text-sm text-rose-400">{error}</p>}
        </form>
      ) : (
        <p className="text-sm text-zinc-500">{t("threadClosed")}</p>
      )}
    </div>
  )
}