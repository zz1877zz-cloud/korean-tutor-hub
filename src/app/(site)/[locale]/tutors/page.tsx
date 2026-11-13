import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import TutorList from "@/components/TutorList"
import JsonLd from "@/components/JsonLd"
import { Link } from "@/i18n/navigation"
import { pageMeta } from "@/lib/seo"
import { tutorListGraph } from "@/lib/jsonld"
import { createClient } from "@/lib/supabase/server"

const tutorColumns =
  "id, bio, display_name, tagline, specialties, languages, hourly_rate, rating, avatar_url, is_active"

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
  let tutors: {
    id: string
    bio: string | null
    display_name: string | null
    tagline: string | null
    specialties: string[] | null
    languages: string[] | null
    hourly_rate: number | null
    rating: number | null
    avatar_url: string | null
    is_active: boolean | null
  }[] = []
  let loadFailed = false
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("tutors")
      .select(tutorColumns)
      .eq("is_active", true)
    tutors = [...(data ?? [])].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    loadFailed = Boolean(error)
  } catch {
    loadFailed = true
  }

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
      {loadFailed ? (
        <p role="alert" className="surface p-6 text-sm text-rose-300">
          {t("loadError")}
        </p>
      ) : (
        <TutorList initialTutors={tutors} />
      )}
      <JsonLd data={tutorListGraph(locale, t("subtitle"), loadFailed ? [] : tutors)} />
    </div>
  )
}
