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
    title: ko ? "튜터 지원" : "Teach with us",
    description: ko
      ? "한국어 튜터로 지원하세요. 소개와 얼굴 사진을 확인한 뒤 공개 목록에 올립니다."
      : "Apply to teach Korean. Profiles go on the public list only after we read the intro and photo.",
  })
}

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
