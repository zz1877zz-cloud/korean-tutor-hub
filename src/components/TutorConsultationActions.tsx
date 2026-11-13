"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

const REASONS = ["schedule", "fit", "capacity", "other"] as const

export default function TutorConsultationActions({
  consultationId,
}: {
  consultationId: string
}) {
  const t = useTranslations("ojakgyo")
  const router = useRouter()
  const supabase = createClient()
  const [reply, setReply] = useState("")
  const [reason, setReason] = useState<(typeof REASONS)[number]>("schedule")
  const [other, setOther] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function accept() {
    setLoading(true)
    setError(null)
    const { error: updateError } = await supabase
      .from("consultations")
      .update({
        status: "accepted",
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

  async function reject() {
    const rejectReason =
      reason === "other" ? other.trim() : t(`reject_${reason}`)
    if (!rejectReason) {
      setError(t("rejectNeedReason"))
      return
    }
    setLoading(true)
    setError(null)
    const { error: updateError } = await supabase
      .from("consultations")
      .update({
        status: "rejected",
        tutor_reply: reply.trim() || null,
        reject_reason: rejectReason,
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
        className="field"
      />
      <div>
        <p className="text-xs text-zinc-500 mb-2">{t("rejectReasonLabel")}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {REASONS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setReason(key)}
              className={`rounded-full px-3 py-1 text-xs border ${
                reason === key
                  ? "border-fuchsia-400 text-fuchsia-200"
                  : "border-white/15 text-zinc-400"
              }`}
            >
              {t(`reject_${key}`)}
            </button>
          ))}
        </div>
        {reason === "other" && (
          <input
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder={t("rejectOtherPlaceholder")}
            className="field"
          />
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={accept}
          className="btn btn-primary flex-1"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={reject}
          className="btn btn-danger flex-1"
        >
          {t("reject")}
        </button>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  )
}