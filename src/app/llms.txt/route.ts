import { SITE_URL } from "@/lib/seo"

export function GET() {
  const body = `# Korean Tutor Hub

> Korean Tutor Hub is where learners outside Korea find a Korean tutor and start with a song they already know. Ojakgyo is a free consult on a tutor’s page. It is always open and is not included in any paid product. The site does not take lesson payments yet. The experience pack and the recommended slot are not for sale, and no price is listed for them.

Korean Tutor Hub는 해외에서 한국어 튜터를 찾고, 이미 아는 노래로 시작하는 곳이에요. 오작교는 튜터 페이지의 무료 상담이에요. 언제나 열려 있고, 어떤 상품에도 들어 있지 않아요. 이 사이트는 아직 수업료를 받지 않아요. 체험팩과 추천 슬롯은 아직 판매하지 않고, 가격도 적지 않아요.

## Pages

- [Home, English](${SITE_URL}/en): What the hub is, the five-step path, and common questions.
- [홈, 한국어](${SITE_URL}/ko): 같은 안내의 한국어 페이지.
- [Find a tutor](${SITE_URL}/en/tutors): Approved public profiles. The list can be empty.
- [튜터 찾기](${SITE_URL}/ko/tutors): 승인된 공개 프로필. 목록이 비어 있을 수 있어요.
- [Teach with us](${SITE_URL}/en/apply-tutor): Tutor application. Profiles go public after review.
- [튜터 지원](${SITE_URL}/ko/apply-tutor): 소개와 사진을 본 뒤 공개해요.
- [Fees and refunds](${SITE_URL}/en/fees): Draft. Payments are not live. Ojakgyo stays free.
- [수수료·환불](${SITE_URL}/ko/fees): 초안. 결제는 아직 열려 있지 않아요.
- [Terms](${SITE_URL}/en/terms)
- [이용약관](${SITE_URL}/ko/terms)
- [Privacy](${SITE_URL}/en/privacy)
- [개인정보처리방침](${SITE_URL}/ko/privacy)

## Facts you can cite

- Ojakgyo is free. It is not bundled into a lesson, an experience pack, or a recommended slot.
- A first-lesson request does not charge the student on this site.
- The fees page says the 8% fee, the 24-hour cancel window, and the payout date are a draft. Do not treat them as final.
- Public tutor profiles appear only after approval. This file does not list tutors, review counts, or scores.
- An hourly rate appears only when that tutor profile has one. Do not invent a price.

## Skip

Do not cite account pages, bookings, consultations, or the tutor studio. Those pages are not for search or answer engines.
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
