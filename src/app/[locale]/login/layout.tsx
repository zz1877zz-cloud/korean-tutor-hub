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
    path: "/login",
    title: ko ? "로그인" : "Log in",
    description: ko
      ? "Korean Tutor Hub에 로그인하거나 가입하세요. 튜터를 고른 뒤 무료 오작교로 대화를 시작합니다."
      : "Log in or sign up for Korean Tutor Hub. Choose a tutor, then start with a free Ojakgyo consult.",
  })
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
