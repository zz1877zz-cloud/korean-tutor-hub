import { SITE_URL } from "@/lib/seo"

export function GET() {
  const body = `# Korean Tutor Hub

> Korean Tutor Hub is for people learning Korean outside Korea. Start with a song you already love, and turn that lyric into Korean you can use in a drama, on a trip, or with a friend. Ojakgyo is a free chat on a tutor’s page. It is not part of any paid product. This site does not charge for lessons yet. The experience pack and the recommended slot are not for sale, and no price is listed for them.

Korean Tutor Hub는 한국 밖에서 한국어를 배우는 사람을 위한 곳이에요. 이미 좋아하는 노래로 시작해서, 그 가사를 드라마, 여행, 친구와의 대화에서 쓸 수 있게 맞춰요. 오작교는 튜터 페이지의 무료 대화예요. 유료 상품에 들어 있지 않아요. 이 사이트는 아직 수업료를 받지 않아요. 체험팩과 추천 슬롯은 아직 팔지 않고, 가격도 적지 않아요.

## Pages

- [Home, English](${SITE_URL}/en): Who it’s for, what you can do with the Korean, and how to start.
- [홈, 한국어](${SITE_URL}/ko): 누구를 위한 곳인지, 무엇을 할 수 있는지, 다음 행동.
- [See tutors](${SITE_URL}/en/tutors): Approved public profiles. The list can be empty.
- [튜터 둘러보기](${SITE_URL}/ko/tutors): 읽고 올린 공개 프로필. 목록이 비어 있을 수 있어요.
- [Teach here](${SITE_URL}/en/apply-tutor): For tutors. Profiles go public only after we read them.
- [튜터로 만나기](${SITE_URL}/ko/apply-tutor): 소개와 사진을 읽어 본 뒤에만 공개해요.
- [Fees and refunds](${SITE_URL}/en/fees): Draft. Payments are not live. Ojakgyo stays free.
- [수수료·환불](${SITE_URL}/ko/fees): 초안. 결제는 아직 열려 있지 않아요.
- [Terms](${SITE_URL}/en/terms)
- [이용약관](${SITE_URL}/ko/terms)
- [Privacy](${SITE_URL}/en/privacy)
- [개인정보처리방침](${SITE_URL}/ko/privacy)

## Facts you can cite

- Ojakgyo is a free chat. It is not bundled into a lesson, an experience pack, or a recommended slot.
- Asking for a first lesson does not charge the student on this site.
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
