export const SPECIALTY_CODES = [
    "topik",
    "conversation",
    "kpop",
    "business",
    "study_abroad",
    "pronunciation",
    "writing",
    "kids",
  ] as const

export type SpecialtyCode = (typeof SPECIALTY_CODES)[number]

export const SPECIALTY_LABELS: Record<
  SpecialtyCode,
  { ko: string; en: string }
> = {
  topik: { ko: "TOPIK 대비", en: "TOPIK" },
  conversation: { ko: "회화", en: "Conversation" },
  kpop: { ko: "K-pop / 가사", en: "K-pop / Lyrics" },
  business: { ko: "비즈니스", en: "Business" },
  study_abroad: { ko: "연수·유학 준비", en: "Study abroad" },
  pronunciation: { ko: "발음", en: "Pronunciation" },
  writing: { ko: "작문", en: "Writing" },
  kids: { ko: "어린이", en: "Kids" },
}

export function specialtyLabel(
    code: string,
    locale: string
  ): string {
    const entry = SPECIALTY_LABELS[code as SpecialtyCode]
    if (!entry) return code
    return locale === "ko" ? entry.ko : entry.en
  }
  
  export function specialtyOptions(locale: string) {
    return SPECIALTY_CODES.map((code) => ({
      value: code,
      label: specialtyLabel(code, locale),
    }))
  }