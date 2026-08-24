import { setRequestLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("home")

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm text-fuchsia-400 mb-4">{t("badge")}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {t("title1")}
          <br />
          <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
            {t("title2")}
          </span>
        </h1>
        <p className="text-zinc-400 mb-8 whitespace-pre-line">{t("subtitle")}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/tutors"
            className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 text-sm font-medium text-white"
          >
            {t("ctaTutors")}
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-300 hover:text-white"
          >
            {t("ctaStart")}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <h2 className="text-white font-semibold mb-2">
              {t(`feature${n}Title`)}
            </h2>
            <p className="text-sm text-zinc-400">{t(`feature${n}Desc`)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}