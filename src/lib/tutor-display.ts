export function formatRating(
  rating: number | string | null | undefined
): string | null {
  if (rating == null || rating === "") return null
  const value = typeof rating === "number" ? rating : Number(rating)
  if (!Number.isFinite(value) || value <= 0) return null
  return value.toFixed(1)
}

export function formatHourly(
  rate: number | string | null | undefined,
  locale: string
): string | null {
  if (rate == null || rate === "") return null
  const value = typeof rate === "number" ? rate : Number(rate)
  if (!Number.isFinite(value)) return null
  const amount = new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US").format(
    value
  )
  return locale === "ko" ? `${amount}원/시간` : `₩${amount}/hour`
}

export function languageLine(
  languages: string[] | null | undefined,
  unset: string
): string {
  const list = (languages ?? []).map((item) => item.trim()).filter(Boolean)
  if (!list.length) return unset
  const shown = list.slice(0, 3)
  const extra = list.length - shown.length
  return extra > 0 ? `${shown.join(" · ")} +${extra}` : shown.join(" · ")
}
