import { setRequestLocale, getTranslations } from "next-intl/server"
import TutorList from "@/components/TutorList"
import { Link } from "@/i18n/navigation"

export default async function TutorsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("tutors")
  const ko = locale === "ko"

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-zinc-400 text-sm mb-4">{t("subtitle")}</p>
      <p className="text-sm text-zinc-500 mb-8">
        {ko
          ? "아직 라인업이 적어도 괜찮아요. 가르칠 수 있으면 먼저 지원해 주세요."
          : "The lineup is still small. If you teach, apply first."}{" "}
        <Link href="/apply-tutor" className="text-violet-300 hover:text-violet-200">
          {ko ? "튜터 지원 →" : "Apply to teach →"}
        </Link>
      </p>
      <TutorList />
    </div>
  )
}