import { getTranslations, setRequestLocale } from "next-intl/server"
import Link from "next/link"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("home")

  return (
    <div className="bg-[#0a0a0f] text-white min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-[#0a0a0f] to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-28 text-center hero-animate">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-fuchsia-400 uppercase mb-5">
            {t("badge")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-6">
            {t("title1")}
            <br />
            <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
              {t("title2")}
            </span>
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/tutors`}
              className="inline-flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition shadow-lg shadow-fuchsia-500/25"
            >
              {t("ctaTutors")}
            </Link>
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center justify-center bg-white/5 text-white px-8 py-3.5 rounded-full font-medium border border-white/15 hover:bg-white/10 transition"
            >
              {t("ctaStart")}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 hover:border-fuchsia-500/40 hover:bg-white/[0.07] transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-xl mb-5">
              🎯
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">{t("feature1Title")}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("feature1Desc")}</p>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/20 flex items-center justify-center text-xl mb-5">
              ⚡
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">{t("feature2Title")}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("feature2Desc")}</p>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 hover:border-pink-500/40 hover:bg-white/[0.07] transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-pink-500/20 flex items-center justify-center text-xl mb-5">
              🌏
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">{t("feature3Title")}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("feature3Desc")}</p>
          </div>
        </div>
      </section>
    </div>
  )
}