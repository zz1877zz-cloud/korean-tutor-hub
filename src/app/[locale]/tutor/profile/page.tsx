import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import TutorProfileForm from "@/components/TutorProfileForm"

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("studio")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: tutor } = await supabase
    .from("tutors")
    .select(
      "id, display_name, tagline, bio, hourly_rate, specialties"
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (!tutor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-2">{t("title")}</h1>
        <p className="text-zinc-400 text-sm mb-4">{t("notTutor")}</p>
        <Link
          href={`/${locale}/apply-tutor`}
          className="text-fuchsia-400 text-sm hover:text-fuchsia-300"
        >
          {t("goApply")}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-zinc-400 text-sm mb-8">{t("desc")}</p>

      <TutorProfileForm
        tutorId={tutor.id}
        initial={{
          display_name: tutor.display_name ?? "",
          tagline: tutor.tagline ?? "",
          bio: tutor.bio ?? "",
          hourly_rate: tutor.hourly_rate,
          specialties: tutor.specialties ?? [],
        }}
      />

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link
          href={`/${locale}/tutors/${tutor.id}`}
          className="text-violet-400 hover:text-violet-300"
        >
          {t("viewPublic")}
        </Link>
        <Link
          href={`/${locale}/tutor/consultations`}
          className="text-zinc-500 hover:text-zinc-300"
        >
          {t("goConsultations")}
        </Link>
      </div>
    </div>
  )
}