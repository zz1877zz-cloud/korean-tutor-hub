import { setRequestLocale, getTranslations } from "next-intl/server"
import TutorList from "@/components/TutorList"

export default async function TutorsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("tutors")

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-zinc-400 text-sm mb-8">{t("subtitle")}</p>
      <TutorList />
    </div>
  )
}