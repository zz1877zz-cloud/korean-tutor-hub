"use client"

import { useTranslations } from "next-intl"

type Review = {
  id: string
  kind: "consultation" | "lesson"
  rating: number
  comment: string | null
  created_at: string
}

export default function TutorReviews({ reviews }: { reviews: Review[] }) {
  const t = useTranslations("reviews")
  const consult = reviews.filter((r) => r.kind === "consultation")
  const lesson = reviews.filter((r) => r.kind === "lesson")

  function avg(list: Review[]) {
    if (!list.length) return null
    return (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1)
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-white mb-4">{t("sectionTitle")}</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-zinc-500 mb-1">💬 {t("consultIcon")}</p>
          <p className="text-xl font-semibold text-amber-400">
            {avg(consult) ? `★ ${avg(consult)}` : t("none")}
          </p>
          <p className="text-xs text-zinc-500 mt-1">{consult.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-zinc-500 mb-1">📘 {t("lessonIcon")}</p>
          <p className="text-xl font-semibold text-amber-400">
            {avg(lesson) ? `★ ${avg(lesson)}` : t("none")}
          </p>
          <p className="text-xs text-zinc-500 mt-1">{lesson.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 && (
          <p className="text-sm text-zinc-500">{t("empty")}</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">
                {r.kind === "consultation" ? `💬 ${t("consultIcon")}` : `📘 ${t("lessonIcon")}`}
              </span>
              <span className="text-amber-400 text-sm">★ {r.rating}</span>
            </div>
            {r.comment && (
              <p className="text-sm text-zinc-200 whitespace-pre-line">{r.comment}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}