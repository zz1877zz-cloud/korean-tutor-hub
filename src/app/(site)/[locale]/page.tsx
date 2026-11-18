import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
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
  const faq = t.raw("faq") as FaqItem[]
  const jsonLd = siteGraph(t("subtitle"), faq)

  return (
    <div>
      <section className="hero-plain">
        <h1>{t("title")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-300">{t("subtitle")}</p>
        <div className="hero-actions">
          <Link href="/tutors" className="btn btn-primary btn-lg">
            {t("ctaTutors")}
          </Link>
          <a href="#trial" className="btn btn-secondary btn-lg">
            {t("ctaTrial")}
          </a>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{t("ctaNote")}</p>
      </section>

      <div className="mx-auto max-w-3xl px-5 pb-16">
        <section id="trial" aria-labelledby="trial-heading" className="mb-12">
          <h2 id="trial-heading" className="mb-2 text-2xl font-bold tracking-tight">
            {t("trialTitle")}
          </h2>
          <p className="mb-4 max-w-2xl text-base leading-relaxed text-zinc-300">
            {t("trialBody")}
          </p>
          <Link href="/tutors" className="btn btn-primary">
            {t("ctaTutors")}
          </Link>
        </section>

        <section id="path" aria-labelledby="path-heading" className="mb-12">
          <h2 id="path-heading" className="mb-2 text-2xl font-bold tracking-tight">
            {t("pathTitle")}
          </h2>
          <p className="mb-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            {t("pathLead")}
          </p>
          <ol className="step-list">
            {STEPS.map(([n, key]) => (
              <li key={key}>
                <span aria-hidden="true" className="step-index">
                  {n}
                </span>
                <div>
                  <h3 className="font-semibold">
                    {t(`${key}Title`)}{" "}
                    <span className="badge">{t(`${key}Badge`)}</span>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                    {t(`${key}Body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-2 text-2xl font-bold tracking-tight">
            {t("faqTitle")}
          </h2>
          <div className="faq-list">
            {faq.map((item) => (
              <article key={item.q}>
                <h3 className="font-semibold">{item.q}</h3>
                <p className="text-sm leading-relaxed text-zinc-300">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <JsonLd data={jsonLd} />
    </div>
  )
}
