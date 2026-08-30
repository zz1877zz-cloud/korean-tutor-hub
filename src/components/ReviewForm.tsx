"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function ReviewForm({
  tutorId,
  kind,
  consultationId,
  bookingId,
}: {
  tutorId: string
  kind: "consultation" | "lesson"
  consultationId?: string
  bookingId?: string
}) {
  const t = useTranslations("reviews")
  const router = useRouter()
  const supabase = createClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      router.push("/login")
      return
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      reviewer_id: user.id,
      tutor_id: tutorId,
      kind,
      rating,
      comment: comment.trim() || null,
      consultation_id: consultationId ?? null,
      booking_id: bookingId ?? null,
    })

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setDone(true)
    router.refresh()
  }

  if (done) {
    return <p className="text-sm text-emerald-300">{t("thanks")}</p>
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-zinc-200">
        {kind === "consultation" ? t("consultTitle") : t("lessonTitle")}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-lg ${n <= rating ? "text-amber-400" : "text-zinc-600"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder={t("placeholder")}
        className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? t("submitting") : t("submit")}
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </form>
  )
}