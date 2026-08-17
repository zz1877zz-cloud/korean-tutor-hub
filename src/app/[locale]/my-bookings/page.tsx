import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import BookingActions from "@/components/BookingActions"
import { setRequestLocale } from "next-intl/server"

export default async function MyBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      id,
      status,
      note,
      cancel_reason,
      created_at,
      tutors (
        bio,
        hourly_rate,
        specialties
      )
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-white">
        {locale === "ko" ? "내 예약" : "My Bookings"}
      </h1>

      {error && (
        <p className="text-red-400 mb-4">
          {locale === "ko"
            ? "예약 정보를 불러오지 못했습니다."
            : "Failed to load bookings."}
        </p>
      )}

      <div className="space-y-4">
        {bookings?.map((booking: any) => (
          <div
            key={booking.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                  booking.status === "pending"
                    ? "bg-amber-500/20 text-amber-300"
                    : booking.status === "confirmed"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : booking.status === "cancelled"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-white/10 text-zinc-400"
                }`}
              >
                {booking.status === "pending" && (locale === "ko" ? "대기중" : "Pending")}
                {booking.status === "confirmed" && (locale === "ko" ? "확정" : "Confirmed")}
                {booking.status === "cancelled" && (locale === "ko" ? "취소됨" : "Cancelled")}
                {booking.status === "completed" && (locale === "ko" ? "완료" : "Completed")}
              </span>
              <span className="text-sm text-zinc-500">
                {new Date(booking.created_at).toLocaleDateString(
                  locale === "ko" ? "ko-KR" : "en-US"
                )}
              </span>
            </div>

            <p className="text-zinc-300 mb-2 line-clamp-2 text-sm">
              {booking.tutors?.bio || (locale === "ko" ? "튜터 정보 없음" : "No tutor info")}
            </p>

            <p className="text-fuchsia-400 font-medium">
              {booking.tutors?.hourly_rate?.toLocaleString()}
              {locale === "ko" ? "원/시간" : " KRW/hour"}
            </p>

            {booking.note && (
              <p className="text-sm text-zinc-500 mt-2">
                {locale === "ko" ? "메모" : "Note"}: {booking.note}
              </p>
            )}

            {booking.status === "cancelled" && booking.cancel_reason && (
              <p className="text-sm text-red-300/80 mt-2">
                {locale === "ko" ? "취소 사유" : "Cancel reason"}: {booking.cancel_reason}
              </p>
            )}

            <BookingActions bookingId={booking.id} status={booking.status} />
          </div>
        ))}
      </div>

      {(!bookings || bookings.length === 0) && (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-4">
            {locale === "ko" ? "아직 예약이 없습니다." : "No bookings yet."}
          </p>
          <Link
            href={`/${locale}/tutors`}
            className="text-violet-400 hover:text-violet-300 transition"
          >
            {locale === "ko" ? "튜터 찾아보기 →" : "Find tutors →"}
          </Link>
        </div>
      )}
    </div>
  )
}