import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

export default async function Footer() {
  const t = await getTranslations("footer")
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer mt-auto border-t border-white/10 bg-[#0a0a0f]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
          {t("blurb")}
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-300">
          <Link href="/tutors" className="underline-offset-4 hover:text-white hover:underline">
            {t("findTutors")}
          </Link>
          <Link href="/#path" className="underline-offset-4 hover:text-white hover:underline">
            {t("how")}
          </Link>
          <Link href="/terms" className="underline-offset-4 hover:text-white hover:underline">
            {t("terms")}
          </Link>
          <Link href="/privacy" className="underline-offset-4 hover:text-white hover:underline">
            {t("privacy")}
          </Link>
          <Link href="/fees" className="underline-offset-4 hover:text-white hover:underline">
            {t("fees")}
          </Link>
          <span>{t("rights", { year })}</span>
        </nav>
      </div>
    </footer>
  )
}
