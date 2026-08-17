import { getTranslations, setRequestLocale } from "next-intl/server"
import TutorList from "@/components/TutorList"

export default async function TutorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params
  const { q } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations("tutors")
  const tCommon = await getTranslations("common")

  return (
    <TutorList
      locale={locale}
      title={t("title")}
      searchPlaceholder={t("searchPlaceholder")}
      searchLabel={tCommon("search")}
      noResults={t("noResults")}
      viewDetail={t("viewDetail")}
      perHour={t("perHour")}
      loadError={t("loadError")}
      initialQuery={q || ""}
    />
  )
}