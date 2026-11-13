import { SITE_URL } from "@/lib/seo"

export type FaqItem = { q: string; a: string }

export type PublicTutor = {
  id: string
  display_name?: string | null
  tagline?: string | null
  bio?: string | null
  languages?: string[] | null
  hourly_rate?: number | string | null
  avatar_url?: string | null
}

function listedRate(rate: PublicTutor["hourly_rate"]) {
  if (rate == null || rate === "") return null
  const value = typeof rate === "number" ? rate : Number(rate)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}

export function tutorPerson(tutor: PublicTutor, locale: string) {
  const ko = locale === "ko"
  const name = tutor.display_name?.trim() || (ko ? "튜터" : "Tutor")
  const about = tutor.tagline?.trim() || tutor.bio?.trim()
  const person: Record<string, unknown> = {
    "@type": "Person",
    name,
    url: `${SITE_URL}/${locale}/tutors/${tutor.id}`,
    jobTitle: ko ? "한국어 튜터" : "Korean tutor",
  }
  if (about) person.description = about
  const languages = (tutor.languages ?? []).map((item) => item.trim()).filter(Boolean)
  if (languages.length) person.knowsLanguage = languages
  if (tutor.avatar_url?.startsWith("http")) person.image = tutor.avatar_url
  const price = listedRate(tutor.hourly_rate)
  if (price != null) {
    person.makesOffer = {
      "@type": "Offer",
      priceCurrency: "KRW",
      price,
      availability: "https://schema.org/InStock",
      description: ko
        ? "프로필에 적힌 시급이에요. 이 사이트는 아직 수업료를 받지 않아요."
        : "Hourly rate listed on the profile. This site does not charge lesson fees yet.",
    }
  }
  return person
}

export function siteGraph(description: string, faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Korean Tutor Hub",
        url: SITE_URL,
        description,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Korean Tutor Hub",
        url: SITE_URL,
        description,
        inLanguage: ["en", "ko"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  }
}

export function tutorListGraph(
  locale: string,
  description: string,
  tutors: PublicTutor[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: locale === "ko" ? "튜터 찾기" : "Find a tutor",
        url: `${SITE_URL}/${locale}/tutors`,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: tutors.length,
          itemListElement: tutors.map((tutor, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: tutorPerson(tutor, locale),
          })),
        },
      },
    ],
  }
}

export function tutorProfileGraph(tutor: PublicTutor, locale: string) {
  return {
    "@context": "https://schema.org",
    ...tutorPerson(tutor, locale),
  }
}
