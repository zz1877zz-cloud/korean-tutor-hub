"use client"

type Filters = {
  specialty: string
  price: string
  language: string
  sort: string
}

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
  locale: string
}

const SPECIALTIES = [
  { value: "", labelKo: "전체", labelEn: "All" },
  { value: "회화", labelKo: "회화", labelEn: "Conversation" },
  { value: "토픽", labelKo: "토픽", labelEn: "TOPIK" },
  { value: "K-pop", labelKo: "K-pop", labelEn: "K-pop" },
  { value: "비즈니스", labelKo: "비즈니스", labelEn: "Business" },
  { value: "발음교정", labelKo: "발음", labelEn: "Pronunciation" },
]

const PRICES = [
  { value: "", labelKo: "전체 가격", labelEn: "Any price" },
  { value: "0-20000", labelKo: "~2만원", labelEn: "Under 20k" },
  { value: "20000-40000", labelKo: "2~4만원", labelEn: "20k–40k" },
  { value: "40000-999999", labelKo: "4만원~", labelEn: "40k+" },
]

const LANGUAGES = [
  { value: "", labelKo: "전체 언어", labelEn: "Any language" },
  { value: "영어", labelKo: "영어", labelEn: "English" },
  { value: "일본어", labelKo: "일본어", labelEn: "Japanese" },
  { value: "중국어", labelKo: "중국어", labelEn: "Chinese" },
  { value: "한국어", labelKo: "한국어만", labelEn: "Korean only" },
]

const SORTS = [
  { value: "rating", labelKo: "평점 높은순", labelEn: "Top rated" },
  { value: "price_asc", labelKo: "가격 낮은순", labelEn: "Price: low" },
  { value: "price_desc", labelKo: "가격 높은순", labelEn: "Price: high" },
]

export default function TutorFilters({ filters, onChange, locale }: Props) {
  const isKo = locale === "ko"

  function update(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value })
  }

  function label(
    item: { labelKo: string; labelEn: string }
  ) {
    return isKo ? item.labelKo : item.labelEn
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 space-y-4">
      {/* 전문 분야 칩 */}
      <div>
        <p className="text-xs text-zinc-500 mb-2">
          {isKo ? "전문 분야" : "Specialty"}
        </p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => update("specialty", s.value)}
              className={`text-xs px-3 py-1.5 rounded-full transition ${
                filters.specialty === s.value
                  ? "bg-fuchsia-600 text-white"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:border-fuchsia-500/40 hover:text-white"
              }`}
            >
              {label(s)}
            </button>
          ))}
        </div>
      </div>

      {/* 가격 / 언어 / 정렬 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={filters.price}
          onChange={(e) => update("price", e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500/50"
        >
          {PRICES.map((p) => (
            <option key={p.value} value={p.value} className="bg-[#0a0a0f]">
              {label(p)}
            </option>
          ))}
        </select>

        <select
          value={filters.language}
          onChange={(e) => update("language", e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500/50"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value} className="bg-[#0a0a0f]">
              {label(l)}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500/50"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#0a0a0f]">
              {label(s)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}