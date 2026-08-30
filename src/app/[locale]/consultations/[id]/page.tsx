import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import ConsultationThread from "@/components/ConsultationThread"
import TutorConsultationActions from "@/components/TutorConsultationActions"

export default async function ConsultationRoomPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const t = await getTranslations("ojakgyo")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: row } = await supabase
    .from("consultations")
    .select("id, message, status, tutor_reply, reject_reason, created_at, student_id, tutor_id")
    .eq("id", id)
    .maybeSingle()

  if (!row) notFound()

  const { data: tutor } = await supabase
    .from("tutors")
    .select("id, user_id, bio")
    .eq("id", row.tutor_id)
    .maybeSingle()

  const isStudent = row.student_id === user.id
  const isTutor = tutor?.user_id === user.id
  if (!isStudent && !isTutor) redirect(`/${locale}/tutors`)

  const canSend = row.status === "pending" || row.status === "accepted"

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href={isTutor ? `/${locale}/tutor/consultations` : `/${locale}/my-consultations`}
        className="text-zinc-400 hover:text-white text-sm mb-6 inline-block"
      >
        ← {t("backToList")}
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2">{t("roomTitle")}</h1>
      <p className="text-zinc-500 text-sm mb-8">
        {new Date(row.created_at).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
        <p className="text-xs text-zinc-500 mb-2">{t("firstMessage")}</p>
        <p className="text-sm text-zinc-200 whitespace-pre-line">{row.message}</p>
        {row.tutor_reply && (
          <div className="mt-4 rounded-xl bg-black/20 p-3">
            <p className="text-xs text-zinc-500 mb-1">{t("tutorReply")}</p>
            <p className="text-sm text-zinc-300 whitespace-pre-line">{row.tutor_reply}</p>
          </div>
        )}
        {row.reject_reason && (
          <p className="mt-3 text-sm text-rose-300">
            {t("rejectReasonLabel")}: {row.reject_reason}
          </p>
        )}
      </div>

      {isTutor && row.status === "pending" && (
        <div className="mb-8">
          <TutorConsultationActions consultationId={row.id} />
        </div>
      )}

      {row.status === "accepted" && isStudent && (
        <Link
          href={`/${locale}/bookings/new?tutor=${row.tutor_id}&consultation=${row.id}`}
          className="inline-block mb-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2 text-sm text-white"
        >
          {t("goBooking")}
        </Link>
      )}

      <ConsultationThread
        consultationId={row.id}
        studentId={row.student_id}
        canSend={canSend}
      />
    </div>
  )
}