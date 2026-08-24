"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function TutorConsultationActions({
  consultationId,
}: {
  consultationId: string
}) {
  const t = useTranslations("ojakgyo")
  const router = useRouter()
  const supabase = createClient()
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateStatus(status: "accepted" | "rejected") {
    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from("consultations")
      .update({
        status,
        tutor_reply: reply.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", consultationId)

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={2}
        placeholder={t("replyPlaceholder")}
        className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("accepted")}
          className="flex-1 rounded-full bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("rejected")}
          className="flex-1 rounded-full border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
        >
          {t("reject")}
        </button>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  )
}