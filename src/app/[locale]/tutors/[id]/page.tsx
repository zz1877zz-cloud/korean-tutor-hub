import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import BookingButton from "@/components/BookingButton"
import Avatar from "@/components/Avatar"
import { getTranslations, setRequestLocale } from "next-intl/server"

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const t = await getTranslations("detail")
  const supabase = await createClient()

  const { data: tutor, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !tutor) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href={`/${locale}/tutors`}
        className="text-zinc-400 hover:text-white transition mb-6 inline-block text-sm"
      >
        ← {t("back")}
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar seed={tutor.id} size="lg" />
          <div className="flex-1 flex items-center justify-between">
            <div className="text-amber-400 text-xl font-medium">★ {tutor.rating}</div>
            <div className="text-2xl font-bold text-fuchsia-400">
              {tutor.hourly_rate?.toLocaleString()}
              {locale === "ko" ? "원" : " KRW"}
              <span className="text-base font-normal text-zinc-500">
                {locale === "ko" ? "/시간" : "/hour"}
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">{t("about")}</h1>
        <p className="text-zinc-300 leading-relaxed mb-8 whitespace-pre-line">
          {tutor.bio}
        </p>

        <div className="mb-6">
          <h2 className="font-semibold text-white mb-2">{t("specialties")}</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.specialties?.map((item: string) => (
              <span
                key={item}
                className="bg-fuchsia-500/15 text-fuchsia-300 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-white mb-2">{t("languages")}</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.languages?.map((item: string) => (
              <span
                key={item}
                className="bg-white/10 text-zinc-300 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <BookingButton tutorId={tutor.id} />
      </div>
    </div>
  )
}