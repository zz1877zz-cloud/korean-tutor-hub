"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function BookingRequestForm({
  tutorId,
  consultationId,
}: {
  tutorId: string
  consultationId: string | null
}) {
  const t = useTranslations("booking")
  const router = useRouter()
  const supabase = createClient()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError(t("needLogin"))
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("bookings").insert({
      student_id: user.id,
      tutor_id: tutorId,
      consultation_id: consultationId,
      status: "pending",
      note: note.trim() || null,
    })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    router.push("/my-bookings")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-400 mb-2">{t("noteLabel")}</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          required
          placeholder={t("notePlaceholder")}
          className="field"
        />
      </div>

      <p className="text-xs text-zinc-500">{t("notConfirmed")}</p>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-block"
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  )
}