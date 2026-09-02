"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLocale, useTranslations } from "next-intl"

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
  const locale = useLocale()
  const ko = locale === "ko"
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [rows, setRows] = useState<Msg[]>([])
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [translated, setTranslated] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)

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

  async function translateText(id: string, text: string) {
    if (translated[id]) return
    setBusyId(id)
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (data.translated) {
        setTranslated((prev) => ({ ...prev, [id]: data.translated }))
      }
    } finally {
      setBusyId(null)
    }
  }

  async function translateDraft() {
    if (!body.trim()) return
    setBusyId("draft")
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body }),
      })
      const data = await res.json()
      if (data.translated) setBody(data.translated)
    } finally {
      setBusyId(null)
    }
  }

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
              {translated[row.id] && (
                <p className="text-sm text-violet-300 mt-2 whitespace-pre-line">
                  {translated[row.id]}
                </p>
              )}
              <button
                type="button"
                onClick={() => translateText(row.id, row.body)}
                disabled={busyId === row.id}
                className="mt-2 text-[11px] text-zinc-500 hover:text-violet-300"
              >
                {busyId === row.id
                  ? ko
                    ? "번역 중…"
                    : "Translating…"
                  : ko
                    ? "한/영 보기"
                    : "Show KO/EN"}
              </button>
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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={translateDraft}
              disabled={!body.trim() || busyId === "draft"}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 disabled:opacity-50"
            >
              {busyId === "draft"
                ? ko
                  ? "번역 중…"
                  : "Translating…"
                : ko
                  ? "입력창 한/영"
                  : "Translate draft"}
            </button>
            <button
              type="submit"
              disabled={loading || !body.trim()}
              className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50"
            >
              {loading ? t("sending") : t("threadSend")}
            </button>
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
        </form>
      ) : (
        <p className="text-sm text-zinc-500">{t("threadClosed")}</p>
      )}
    </div>
  )
}