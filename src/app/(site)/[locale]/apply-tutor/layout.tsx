import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { pageMeta } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const ko = locale === "ko"
  return pageMeta({
    locale,
    path: "/apply-tutor",
    title: ko ? "튜터로 만나기" : "Teach here",
    description: ko
      ? "노래부터 시작하는 학생을 만나요. 소개와 사진을 읽어 본 뒤에만 프로필을 올려요."
      : "Teach students who start from a song they love. We publish a profile only after we read it.",
  })
}

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
