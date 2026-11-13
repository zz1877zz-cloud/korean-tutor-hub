import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import TutorBookingActions from "@/components/TutorBookingActions"

export default async function TutorBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("booking")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: tutor } = await supabase
    .from("tutors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!tutor) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-2">
          {t("tutorBookingsTitle")}
        </h1>
        <p className="text-zinc-400 text-sm">{t("notTutor")}</p>
      </div>
    )
  }

  const { data: rows, error } = await supabase
    .from("bookings")
    .select("id, status, note, created_at, student_id, consultation_id")
    .eq("tutor_id", tutor.id)
    .order("created_at", { ascending: false })

  const statusLabel = (status: string) => {
    if (status === "pending") return t("statusPending")
    if (status === "confirmed") return t("statusConfirmed")
    if (status === "cancelled") return t("statusCancelled")
    if (status === "completed") return t("statusCompleted")
    return status
  }

  const statusClass = (status: string) => {
    if (status === "pending") return "bg-amber-500/15 text-amber-300"
    if (status === "confirmed") return "bg-emerald-500/15 text-emerald-300"
    if (status === "cancelled") return "bg-rose-500/15 text-rose-300"
    if (status === "completed") return "bg-violet-500/15 text-violet-300"
    return "bg-white/10 text-zinc-400"
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">
        {t("tutorBookingsTitle")}
      </h1>
      <p className="text-zinc-400 text-sm mb-2">{t("tutorBookingsDesc")}</p>
      <p className="text-xs text-zinc-500 mb-8">{t("bridgeNote")}</p>

      {error && <p className="text-rose-400 text-sm mb-4">{error.message}</p>}

      {!rows?.length && !error && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
          {t("tutorBookingsEmpty")}
        </div>
      )}

      <div className="space-y-4">
        {rows?.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-xs text-zinc-500">
                {new Date(row.created_at).toLocaleString(
                  locale === "ko" ? "ko-KR" : "en-US"
                )}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                  row.status
                )}`}
              >
                {statusLabel(row.status)}
              </span>
            </div>

            {row.note && (
              <p className="text-zinc-200 text-sm mb-4 whitespace-pre-line">
                {row.note}
              </p>
            )}

            {(row.status === "pending" || row.status === "confirmed") && (
              <TutorBookingActions bookingId={row.id} status={row.status} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href={`/${locale}/tutor/consultations`}
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          {t("goConsultations")}
        </Link>
      </div>
    </div>
  )
}