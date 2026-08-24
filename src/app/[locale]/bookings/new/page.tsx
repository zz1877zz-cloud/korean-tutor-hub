import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import BookingRequestForm from "@/components/BookingRequestForm"

export default async function NewBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tutor?: string; consultation?: string }>
}) {
  const { locale } = await params
  const { tutor: tutorId, consultation: consultationId } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations("booking")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  if (!tutorId) {
    redirect(`/${locale}/tutors`)
  }

  const { data: tutor } = await supabase
    .from("tutors")
    .select("id, bio, hourly_rate, specialties")
    .eq("id", tutorId)
    .maybeSingle()

  if (!tutor) {
    redirect(`/${locale}/tutors`)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">{t("requestTitle")}</h1>
      <p className="text-zinc-400 text-sm mb-6">{t("requestHint")}</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6 text-sm text-zinc-300">
        <p className="text-zinc-500 text-xs mb-1">{t("tutorLabel")}</p>
        <p className="line-clamp-3">{tutor.bio}</p>
        {tutor.hourly_rate != null && (
          <p className="mt-2 text-fuchsia-300">
            {Number(tutor.hourly_rate).toLocaleString()}
            {locale === "ko" ? "원/시간" : " KRW/hour"}
          </p>
        )}
      </div>

      <BookingRequestForm
        tutorId={tutor.id}
        consultationId={consultationId ?? null}
      />
    </div>
  )
}