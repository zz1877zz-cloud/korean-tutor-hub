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
    path: "/fees",
    title: ko ? "수수료 · 환불" : "Fees and refunds",
    description: ko
      ? "오작교는 무료이고 어떤 상품에도 들어 있지 않아요. 체험팩과 추천 슬롯은 아직 판매하지 않아요. 수업료는 사이트에서 받지 않아요."
      : "Ojakgyo is free and not part of a package. The experience pack and recommended slot are not for sale. The site does not charge lesson fees yet.",
  })
}

export default async function FeesPage({
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
        {ko ? "수수료 · 환불 세칙 (초안)" : "Fees & Refunds (draft)"}
      </h1>
      <p className="text-zinc-500">
        {ko
          ? "버전 0.1 · 2026-09-01 · 플랫폼 결제가 열리기 전에는 아래 금액은 적용되지 않아요."
          : "v0.1 · 2026-09-01 · Fee and refund amounts do not apply until in-app payments launch."}
      </p>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "1. 지금" : "1. Until payments"}</h2>
        <p>
          {ko
            ? "지금은 Korean Tutor Hub가 수업료를 받지 않아요. 오작교와 예약만 연결해요. 당사자가 직접 주고받은 돈의 환불은 당사자 책임이에요."
            : "The hub does not collect lesson fees yet. We only broker consultations and bookings. Refunds for money sent directly between parties are their responsibility."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "2. 결제 연동 후 수수료" : "2. Platform fee after checkout"}</h2>
        <p>
          {ko
            ? "수업이 사이트에서 결제되고 상태가 completed가 되면, 회사 수수료는 수업료의 8%예요. 부가세·원천징수는 사업자 등록 후 알려 드려요."
            : "When a lesson is paid on the site and marked completed, the platform fee is 8% of the lesson price. VAT and withholding will be announced after business registration."}
        </p>
        <p>
          {ko
            ? "정산 초안: 매월 1일부터 말일까지 끝난 수업은 다음 달 15일에 튜터 계좌로 보내요. 환불·차지백·진행하지 않은 수업은 빼거나 상계해요."
            : "Payout draft: completed lessons from the 1st–last of the month are paid on the 15th of the next month. Refunds, chargebacks, and untaught lessons are excluded or offset."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "3. 학생 취소 (결제 후)" : "3. Student cancel (after payment)"}</h2>
        <p>
          {ko
            ? "예약 확정 시각 기준 24시간 이전 취소: 전액 환불. 24시간 이내: 수업료의 50% 환불(세칙 확정 전 제안). 수업 시작 이후: 환불 없음. 튜터 귀책이면 전액."
            : "Cancel 24 hours or more before the confirmed time: full refund. Within 24 hours: 50% refund (proposal, not final). After start: no refund. Tutor’s fault: full refund."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "4. 튜터 취소 · 노쇼" : "4. Tutor cancel and no-show"}</h2>
        <p>
          {ko
            ? "튜터가 확정 후 취소하면 학생은 전액 환불입니다. 반복 취소·무응답은 프로필 비활성 사유가 됩니다. 합의 시각에 한쪽이 나타나지 않으면 상대 귀책으로 볼 수 있으며, 증빙은 오작교 기록입니다."
            : "If the tutor cancels after confirm, the student is refunded in full. Repeat cancels or silence can deactivate the profile. A no-show at the agreed time may be treated as that party’s fault. Ojakgyo messages are the record."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "5. 오작교" : "5. Consultations"}</h2>
        <p>
          {ko
            ? "오작교는 무료 상담이에요. 오작교만으로는 수업료가 생기지 않아요. 거절하면 그 이유를 기록해요."
            : "Ojakgyo is a free consult channel. A consult alone does not create a lesson fee. Decline reasons are stored."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">
          {ko ? "6. 체험팩 · 추천 슬롯" : "6. Experience pack and recommended slot"}
        </h2>
        <p>
          {ko
            ? "체험팩은 첫 유료 수업 다음에 제안할 짧은 수업 묶음이에요. 추천 슬롯은 튜터 프로필을 목록 앞에 두는 유료 자리예요. 둘 다 아직 판매하지 않고, 이 페이지에 가격을 적지 않아요."
            : "An experience pack would be a short series after the first paid lesson. A recommended slot would place a tutor profile nearer the top of the list. Neither is for sale, and this page lists no price for them."}
        </p>
        <p>
          {ko
            ? "오작교는 위 상품에 끼워 넣지 않아요. 무료 입구로 남아요. 지금 목록 순서는 평점과 필터 결과이고, 돈을 내고 산 순위가 아니에요."
            : "Ojakgyo is not bundled into either product. It stays the free consult. The list order you see today comes from rating and filters, not from a purchased placement."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "7. 변경" : "7. Changes"}</h2>
        <p>
          {ko
            ? "숫자(8%, 24시간, 50%, 15일)는 초안이에요. 결제가 열리기 전에 이 페이지에서 확정본을 알려 드려요."
            : "The numbers (8%, 24 hours, 50%, the 15th) are a draft. A final version will be posted here before checkout opens."}
        </p>
      </section>
    </div>
  )
}