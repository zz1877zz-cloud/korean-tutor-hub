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
      <h2 className="text-lg font-bold text-white mb-2">{t("sectionTitle")}</h2>
      <p className="mb-4 text-sm leading-relaxed text-zinc-300">{t("sectionNote")}</p>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="surface p-4">
          <p className="mb-1 text-xs text-zinc-400">{t("consultIcon")}</p>
          <p className={avg(consult) ? "rating text-xl" : "text-xl font-semibold text-zinc-300"}>
            {avg(consult) ? `★ ${avg(consult)}` : t("none")}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {t("countLabel", { count: consult.length })}
          </p>
        </div>
        <div className="surface p-4">
          <p className="mb-1 text-xs text-zinc-400">{t("lessonIcon")}</p>
          <p className={avg(lesson) ? "rating text-xl" : "text-xl font-semibold text-zinc-300"}>
            {avg(lesson) ? `★ ${avg(lesson)}` : t("none")}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {t("countLabel", { count: lesson.length })}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 && (
          <p className="surface p-4 text-sm leading-relaxed text-zinc-300">{t("empty")}</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">
                {r.kind === "consultation" ? `💬 ${t("consultIcon")}` : `📘 ${t("lessonIcon")}`}
              </span>
              <span className="rating text-sm">★ {r.rating}</span>
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