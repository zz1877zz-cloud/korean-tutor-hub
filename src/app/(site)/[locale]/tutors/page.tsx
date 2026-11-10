import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import TutorList from "@/components/TutorList"
import { Link } from "@/i18n/navigation"
import { pageMeta } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "tutors" })
  return pageMeta({
    locale,
    path: "/tutors",
    title: t("metaTitle"),
    description: t("subtitle"),
  })
}

export default async function TutorsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("tutors")

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">{t("title")}</h1>
      <p className="mb-3 max-w-2xl text-base leading-relaxed text-zinc-200">
        {t("subtitle")}
      </p>
      <p className="mb-8 text-sm leading-relaxed text-zinc-400">
        {t("lineupNote")}{" "}
        <Link
          href="/apply-tutor"
          className="font-medium text-fuchsia-200 underline decoration-fuchsia-300/40 underline-offset-4"
        >
          {t("applyLink")}
        </Link>
      </p>
      <TutorList />
    </div>
  )
}
