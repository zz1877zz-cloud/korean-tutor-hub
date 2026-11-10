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
    path: "/privacy",
    title: ko ? "개인정보처리방침" : "Privacy policy",
    description: ko
      ? "Korean Tutor Hub가 계정, 오작교, 예약 정보를 다루는 방식이에요."
      : "How Korean Tutor Hub handles account, consultation, and booking information.",
  })
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const ko = locale === "ko"

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-zinc-300 text-sm leading-relaxed space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {ko ? "개인정보처리방침" : "Privacy Policy"}
      </h1>
      <p className="text-zinc-500">
        {ko
          ? "시행일: 2026-09-01 · 운영자: Korean Tutor Hub (1인 운영, 사업자 등록 전)"
          : "Effective: 2026-09-01 · Operator: Korean Tutor Hub (solo operator, pre-business registration)"}
      </p>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "1. 수집 항목" : "1. What we collect"}</h2>
        <p>
          {ko
            ? "이메일, 비밀번호(암호화되어 인증 서버에 저장), 역할(학생/튜터/관리자), 프로필·소개, 프로필 사진, 오작교·예약 내용, 리뷰, 접속 기록."
            : "Email, password (stored hashed by the auth provider), role (student/tutor/admin), profile text, photos, consultation and booking content, reviews, and access logs."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "2. 이용 목적" : "2. Why"}</h2>
        <p>
          {ko
            ? "회원 인증, 튜터 연결, 오작교·예약 운영, 품질 관리, 부정 이용 방지, 서비스 개선. 결제 기능이 생기면 정산·세무에 필요한 항목을 더해 알려 드려요."
            : "Sign-in, matching, Ojakgyo and bookings, quality control, abuse prevention, and product improvement. Payment fields will be announced if checkout launches."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "3. 보관 · 위탁" : "3. Storage and processors"}</h2>
        <p>
          {ko
            ? "인증·데이터베이스·파일 저장은 Supabase, 웹 호스팅은 Vercel을 써요. 서버 지역은 프로젝트 설정(서울 리전)을 따라요."
            : "Auth, database, and files run on Supabase. Hosting runs on Vercel. The database region follows the project setting (Seoul)."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "4. 공개 범위" : "4. What is public"}</h2>
        <p>
          {ko
            ? "튜터 프로필, 공개 글, 리뷰는 로그인 없이 보일 수 있어요. 오작교 메시지와 예약 메모는 그 학생·튜터·관리자에게만 보여요."
            : "Tutor profiles, public posts, and reviews may be visible without login. Ojakgyo messages and booking notes are visible only to the student, tutor, and admin."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "5. 보유 기간" : "5. Retention"}</h2>
        <p>
          {ko
            ? "회원을 탈퇴하면 계정과 프로필을 지워요. 법에 따라 보관해야 하거나 다툼 중인 기록은 그 기간만 남길 수 있어요."
            : "We delete the account and profile on withdrawal. Records required by law or needed for an open dispute may be kept only for that period."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "6. 권리" : "6. Your rights"}</h2>
        <p>
          {ko
            ? "열람·수정·삭제를 요청할 수 있어요. 문의는 가입할 때 쓴 이메일로 운영자에게 연락해 주세요. (푸터 또는 로그인 계정)"
            : "You may request access, correction, or deletion. Contact the operator from the email used to register."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "7. 쿠키" : "7. Cookies"}</h2>
        <p>
          {ko
            ? "로그인을 유지하려고 꼭 필요한 쿠키를 써요. 광고 추적 쿠키는 지금 쓰지 않아요."
            : "We use essential cookies to keep you signed in. We do not currently use advertising trackers."}
        </p>
      </section>
    </div>
  )
}