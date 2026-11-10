import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Providers from "@/components/Providers"
import { bodyClassName, themeBootScript } from "@/lib/fonts"
import { siteMetadata, siteViewport, supabaseOrigin } from "@/lib/site-metadata"
import "../../globals.css"

const locales = ["en", "ko"] as const

export const metadata = siteMetadata
export const viewport = siteViewport

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
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        {supabaseOrigin ? (
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        ) : null}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={bodyClassName}>
        <Providers>
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
        </Providers>
      </body>
    </html>
  )
}
