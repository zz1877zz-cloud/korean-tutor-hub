import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const locales = ["en", "ko"] as const

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as "en" | "ko")) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations("common")

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col">
        <a href="#content" className="skip-link">
          {t("skipToContent")}
        </a>
        <Header />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}