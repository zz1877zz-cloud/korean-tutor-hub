import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/server"
import TutorCard, { type TutorCardLabels } from "@/components/TutorCard"
import JsonLd from "@/components/JsonLd"
import { pageMeta } from "@/lib/seo"
import { siteGraph, type FaqItem } from "@/lib/jsonld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "seo" })
  const home = await getTranslations({ locale, namespace: "home" })
  return pageMeta({
    locale,
    path: "/",
    title: home("metaTitle"),
    description: t("description"),
  })
}

const STEPS = [
  ["1", "step1", ""],
  ["2", "step2", "badge-free"],
  ["3", "step3", ""],
  ["4", "step4", ""],
  ["5", "step5", ""],
] as const

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("home")
  const tutorsT = await getTranslations("tutors")
  let tutors: {
    id: string
    bio: string | null
    avatar_url: string | null
    display_name: string | null
    tagline: string | null
    hourly_rate: number | null
    rating: number | null
    languages: string[] | null
    specialties: string[] | null
  }[] = []
  let loadFailed = false
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("tutors")
      .select(
        "id, bio, avatar_url, display_name, tagline, hourly_rate, rating, languages, specialties"
      )
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(6)
    tutors = data ?? []
    loadFailed = Boolean(error)
  } catch {
    loadFailed = true
  }

  const faq = t.raw("faq") as FaqItem[]
  const labels: TutorCardLabels = {
    unnamed: tutorsT("unnamed"),
    reviewsPending: tutorsT("reviewsPending"),
    rateUnset: tutorsT("rateUnset"),
    languagesLabel: tutorsT("languagesLabel"),
    languagesUnset: tutorsT("languagesUnset"),
    bioUnset: tutorsT("bioUnset"),
  }

  const jsonLd = siteGraph(t("subtitle"), faq)

  return (
    <div className="relative">
      <div
        className="hero-stage pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <picture className="absolute inset-0">
          <source
            type="image/webp"
            media="(min-width: 768px)"
            srcSet="/hero-lyrics-wide.webp"
          />
          <source media="(min-width: 768px)" srcSet="/hero-lyrics-wide.jpg" />
          <source type="image/webp" srcSet="/hero-lyrics-mobile.webp" />
          <img
            src="/hero-lyrics-mobile.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        </picture>
        <picture className="absolute inset-0">
          <source
            type="image/webp"
            media="(min-width: 768px)"
            srcSet="/hero-ojakgyo-wide.webp"
          />
          <source media="(min-width: 768px)" srcSet="/hero-ojakgyo-wide.jpg" />
          <source type="image/webp" srcSet="/hero-ojakgyo-mobile.webp" />
          <img
            src="/hero-ojakgyo-mobile.jpg"
            alt=""
            fetchPriority="low"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        </picture>
        <div className="absolute inset-0 bg-[#0a0a0f]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/25 via-[#0a0a0f]/55 to-[#0a0a0f]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16">
        <section className="hero-copy max-w-3xl pt-12 pb-12 md:pt-20 md:pb-16">
          <p className="kicker mb-3">{t("eyebrow")}</p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-100 sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/tutors" className="btn btn-primary w-full sm:w-auto">
              {t("ctaTutors")}
            </Link>
            <a href="#path" className="btn btn-secondary w-full sm:w-auto">
              {t("ctaHow")}
            </a>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-200">
            {t("ctaNote")}{" "}
            <Link
              href="/apply-tutor"
              className="underline decoration-white/40 underline-offset-4 hover:text-white"
            >
              {t("ctaTeach")}
            </Link>
          </p>
        </section>

        <section id="path" aria-labelledby="path-heading" className="mb-14">
          <h2 id="path-heading" className="mb-2 text-xl font-bold text-white">
            {t("pathTitle")}
          </h2>
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-300">
            {t("pathLead")}
          </p>
          <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {STEPS.map(([n, key, badgeTone]) => (
              <li key={key} className="surface flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white"
                  >
                    {n}
                  </span>
                  <span className={`badge ${badgeTone}`}>
                    {t(`${key}Badge`)}
                  </span>
                </div>
                <h3 className="font-semibold text-white">{t(`${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {t(`${key}Body`)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-heading" className="mb-14">
          <h2 id="faq-heading" className="mb-4 text-xl font-bold text-white">
            {t("faqTitle")}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <article key={item.q} className="surface p-4">
                <h3 className="font-semibold text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="tutors-heading">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 id="tutors-heading" className="text-xl font-bold text-white">
                {t("tutorsTitle")}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-300">
                {t("tutorsLead")}
              </p>
            </div>
            <Link
              href="/tutors"
              className="shrink-0 text-sm font-medium text-fuchsia-200 underline-offset-4 hover:underline"
            >
              {t("tutorsMore")}
            </Link>
          </div>

          {loadFailed && (
            <p role="alert" className="surface p-6 text-sm text-rose-300">
              {t("tutorsError")}
            </p>
          )}

          {!loadFailed && !tutors.length && (
            <p className="surface p-6 text-sm leading-relaxed text-zinc-300">
              {t("tutorsEmpty")}
            </p>
          )}

          {!loadFailed && tutors.length > 0 && (
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 md:grid-cols-3">
              {tutors.map((tutor) => (
                <li key={tutor.id}>
                  <TutorCard
                    tutor={tutor}
                    locale={locale}
                    labels={labels}
                    heading="h3"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <JsonLd data={jsonLd} />
    </div>
  )
}
