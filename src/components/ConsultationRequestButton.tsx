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
          className="w-full rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition"
        >
          {t("requestButton")}
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <p className="text-sm text-zinc-300">{t("hint")}</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={t("placeholder")}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? t("sending") : t("send")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-400 hover:text-white"
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