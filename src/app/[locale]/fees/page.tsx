import { setRequestLocale } from "next-intl/server"

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
          ? "버전 0.1 · 2026-09-01 · 플랫폼 결제가 열리기 전에는 아래 금액 조항이 적용되지 않습니다."
          : "v0.1 · 2026-09-01 · Fee and refund amounts do not apply until in-app payments launch."}
      </p>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "1. 지금" : "1. Until payments"}</h2>
        <p>
          {ko
            ? "현재 Korean Tutor Hub는 수업료를 받지 않습니다. 오작교·예약만 중개합니다. 당사자가 직접 주고받은 돈의 환불은 당사자 책임입니다."
            : "The hub does not collect lesson fees yet. We only broker consultations and bookings. Refunds for money sent directly between parties are their responsibility."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "2. 결제 연동 후 수수료" : "2. Platform fee after checkout"}</h2>
        <p>
          {ko
            ? "수업이 사이트에서 결제되고 상태가 completed가 되면, 회사 수수료는 수업료의 8%입니다. 부가세·원천징수는 사업자 등록 후 고지합니다."
            : "When a lesson is paid on the site and marked completed, the platform fee is 8% of the lesson price. VAT and withholding will be announced after business registration."}
        </p>
        <p>
          {ko
            ? "정산 초안: 매월 1~말일 완료 건 → 익월 15일 튜터 계좌. 환불·차지백·미진행은 제외하거나 상계합니다."
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
        <h2 className="text-white font-semibold">{ko ? "5. 상담" : "5. Consultations"}</h2>
        <p>
          {ko
            ? "오작교는 무료 상담 채널입니다. 상담만으로 수업료가 발생하지 않습니다. 상담 거절 시 사유는 기록됩니다."
            : "Ojakgyo is a free consult channel. A consult alone does not create a lesson fee. Decline reasons are stored."}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-white font-semibold">{ko ? "6. 변경" : "6. Changes"}</h2>
        <p>
          {ko
            ? "숫자(8%, 24시간, 50%, 15일)는 초안입니다. 결제 오픈 전에 이 페이지에서 확정본을 고지합니다."
            : "The numbers (8%, 24 hours, 50%, the 15th) are a draft. A final version will be posted here before checkout opens."}
        </p>
      </section>
    </div>
  )
}