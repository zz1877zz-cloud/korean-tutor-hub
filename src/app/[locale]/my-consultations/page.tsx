import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"

export default async function MyConsultationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("ojakgyo")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: rows, error } = await supabase
    .from("consultations")
    .select(
      `
      id,
      message,
      status,
      tutor_reply,
      created_at,
      tutor_id,
      tutors (
        id,
        bio,
        hourly_rate,
        specialties
      )
    `
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  const statusLabel = (status: string) => {
    if (status === "pending") return t("statusPending")
    if (status === "accepted") return t("statusAccepted")
    if (status === "rejected") return t("statusRejected")
    if (status === "cancelled") return t("statusCancelled")
    return status
  }

  const statusClass = (status: string) => {
    if (status === "pending") return "bg-amber-500/15 text-amber-300"
    if (status === "accepted") return "bg-emerald-500/15 text-emerald-300"
    if (status === "rejected") return "bg-rose-500/15 text-rose-300"
    return "bg-white/10 text-zinc-400"
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">{t("myTitle")}</h1>
      <p className="text-zinc-400 text-sm mb-8">{t("myDesc")}</p>

      {error && (
        <p className="text-rose-400 text-sm mb-4">{error.message}</p>
      )}

      {!rows?.length && !error && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
          <p className="mb-4">{t("empty")}</p>
          <Link
            href={`/${locale}/tutors`}
            className="inline-block rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2 text-sm text-white"
          >
            {t("browseTutors")}
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {rows?.map((row) => {
          const tutor = Array.isArray(row.tutors) ? row.tutors[0] : row.tutors
          return (
            <div
              key={row.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <Link
                    href={`/${locale}/tutors/${row.tutor_id}`}
                    className="text-fuchsia-300 hover:text-fuchsia-200 text-sm"
                  >
                    {t("viewTutor")}
                  </Link>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(row.created_at).toLocaleString(
                      locale === "ko" ? "ko-KR" : "en-US"
                    )}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                    row.status
                  )}`}
                >
                  {statusLabel(row.status)}
                </span>
              </div>

              <p className="text-zinc-200 text-sm mb-3 whitespace-pre-line">
                {row.message}
              </p>

              {tutor?.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(tutor.specialties as string[]).map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-white/10 text-zinc-400 px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {row.tutor_reply && (
                <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-zinc-500 mb-1">{t("tutorReply")}</p>
                  <p className="text-sm text-zinc-300 whitespace-pre-line">
                    {row.tutor_reply}
                  </p>
                </div>
              )}

              {row.status === "accepted" && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-zinc-500">
                    {locale === "ko"
                      ? "수락은 예약 확정이 아닙니다. 일정을 남겨 예약 요청을 보내 주세요."
                      : "Acceptance is not a confirmed booking. Send a booking request with your preferred times."}
                  </p>
                  <Link
                    href={`/${locale}/bookings/new?tutor=${row.tutor_id}&consultation=${row.id}`}
                    className="inline-block rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2 text-sm text-white"
                  >
                    {locale === "ko" ? "예약 요청하기" : "Request booking"}
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}