"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function ConsultationRequestButton({
  tutorId,
}: {
  tutorId: string
}) {
  const t = useTranslations("ojakgyo")
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setResult(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      router.push("/login")
      return
    }

    const { error } = await supabase.from("consultations").insert({
      student_id: user.id,
      tutor_id: tutorId,
      message: message.trim(),
      status: "pending",
    })

    setLoading(false)

    if (error) {
      setResult(error.message || t("error"))
      return
    }

    void fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "consultation",
        preview: message.trim(),
      }),
    })

    setResult(t("success"))
    setMessage("")
    setOpen(false)
  }

  return (
    <div className="space-y-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-primary btn-block"
        >
          {t("requestButton")}
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <p id="ojakgyo-hint" className="text-sm leading-relaxed text-zinc-300">
            {t("hint")}
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={t("placeholder")}
            aria-describedby="ojakgyo-hint"
            className="field"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? t("sending") : t("send")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-secondary"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {result && <p className="text-sm text-zinc-400">{result}</p>}
    </div>
  )
}