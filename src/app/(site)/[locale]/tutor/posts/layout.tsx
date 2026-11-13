import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { privatePageMeta } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  return privatePageMeta(locale === "ko" ? "채널 글" : "Channel posts")
}

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
