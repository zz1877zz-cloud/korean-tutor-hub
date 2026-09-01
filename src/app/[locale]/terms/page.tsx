import { setRequestLocale } from "next-intl/server"

export default async function TermsPage({
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
        {ko ? "이용약관" : "Terms of Use"}
      </h1>
      <p className="text-zinc-500">
        {ko
          ? "시행일: 2026-09-01 · Korean Tutor Hub · 버전 0.1 (결제 연동 전)"
          : "Effective: 2026-09-01 · Korean Tutor Hub · v0.1 (before payments)"}
      </p>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "1. 서비스" : "1. Service"}</h2>
        <p>
          {ko
            ? "본 사이트는 한국어 학습 학생과 튜터를 연결하는 중개 플랫폼입니다. 운영자는 수업을 직접 제공하지 않습니다."
            : "This site is a marketplace that connects Korean-language students and tutors. The operator does not teach the lessons."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "2. 계정" : "2. Accounts"}</h2>
        <p>
          {ko
            ? "만 14세 미만은 보호자 동의 없이 가입할 수 없습니다. 허위 정보, 중복 계정, 타인 명의 사용은 제한될 수 있습니다."
            : "Users under 14 need a guardian’s consent. False information, duplicate accounts, or using another person’s identity may be restricted."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "3. 오작교와 예약" : "3. Ojakgyo and bookings"}</h2>
        <p>
          {ko
            ? "오작교 상담 수락은 수업 확정이 아닙니다. 수업은 예약 요청 후 튜터가 확정한 때에 성립합니다. Zoom 링크와 일정은 당사자가 오작교에서 합의합니다."
            : "Accepting an Ojakgyo consultation is not a confirmed lesson. A lesson starts only after the tutor confirms a booking. Zoom links and times are agreed in Ojakgyo."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "4. 수수료" : "4. Fees"}</h2>
        <p>
          {ko
            ? "플랫폼 결제가 열리기 전에는 수업료를 사이트에서 받지 않습니다. 결제 연동 후 성사 수수료는 수업료의 8%를 기준으로 하며, 세칙은 별도로 고지합니다."
            : "We do not collect lesson fees on the site until payments are enabled. After that, the platform fee is 8% of the lesson price, with details announced separately."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "5. 금지" : "5. Prohibited"}</h2>
        <p>
          {ko
            ? "성희롱, 혐오, 허위 경력, 리뷰 조작, 미성년 대상 부적절한 연락, 결제 연동 이후의 상습적 중개 우회를 금지합니다."
            : "Harassment, hate speech, fake credentials, review manipulation, inappropriate contact with minors, and habitual off-platform payment after checkout launches are prohibited."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "6. 책임" : "6. Liability"}</h2>
        <p>
          {ko
            ? "학습 효과, 유학·비자 결과는 보장하지 않습니다. 수업 내용의 1차 책임은 튜터에게 있습니다. 운영자의 고의·중과실이 없으면 책임은 해당 건 수수료 범위로 한정됩니다."
            : "We do not guarantee learning results, visas, or school admission. Tutors are primarily responsible for lessons. Absent willful misconduct or gross negligence, operator liability is limited to the fee for that booking."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "7. 준거법" : "7. Law"}</h2>
        <p>
          {ko
            ? "대한민국 법을 따릅니다. 약관은 사이트에 게시하는 방법으로 변경할 수 있습니다."
            : "These terms follow the laws of the Republic of Korea and may be updated on this page."}
        </p>
      </section>
    </div>
  )
}