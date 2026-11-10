"use client"

import { useLocale, useTranslations } from "next-intl"
import { specialtyOptions } from "@/lib/specialties"

export type TutorFilterState = {
  q: string
  specialties: string[]
  language: string
  maxPrice: string
  sort: "rating" | "price_asc" | "price_desc"
}

type Props = {
  value: TutorFilterState
  onChange: (next: TutorFilterState) => void
}

export default function TutorFilters({ value, onChange }: Props) {
  const t = useTranslations("filters")
  const locale = useLocale()
  const specialties = specialtyOptions(locale)

  function patch(partial: Partial<TutorFilterState>) {
    onChange({ ...value, ...partial })
  }

  function toggleSpecialty(code: string) {
    const exists = value.specialties.includes(code)
    patch({
      specialties: exists
        ? value.specialties.filter((s) => s !== code)
        : [...value.specialties, code],
    })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
      <div>
        <label htmlFor="tutor-search" className="mb-1.5 block text-xs text-zinc-300">
          {t("search")}
        </label>
        <input
          id="tutor-search"
          type="search"
          value={value.q}
          onChange={(e) => patch({ q: e.target.value })}
          placeholder={t("searchPlaceholder")}
          className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-xs text-zinc-300">{t("specialty")}</legend>
        <div className="flex flex-wrap gap-2">
          {specialties.map((item) => {
            const active = value.specialties.includes(item.value)
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSpecialty(item.value)}
                className={`min-h-11 rounded-full px-3 text-xs transition ${
                  active
                    ? "bg-fuchsia-500/25 text-fuchsia-100 border border-fuchsia-400/40"
                    : "bg-white/5 text-zinc-200 border border-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="tutor-language" className="mb-1.5 block text-xs text-zinc-300">
            {t("language")}
          </label>
          <select
            id="tutor-language"
            value={value.language}
            onChange={(e) => patch({ language: e.target.value })}
            className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          >
            <option value="">{t("languageAll")}</option>
            <option value="ko">{t("languageKo")}</option>
            <option value="en">{t("languageEn")}</option>
          </select>
        </div>

        <div>
          <label htmlFor="tutor-max-price" className="mb-1.5 block text-xs text-zinc-300">
            {t("maxPrice")}
          </label>
          <input
            id="tutor-max-price"
            type="number"
            min={0}
            inputMode="numeric"
            value={value.maxPrice}
            onChange={(e) => patch({ maxPrice: e.target.value })}
            placeholder={t("maxPricePlaceholder")}
            className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tutor-sort" className="mb-1.5 block text-xs text-zinc-300">
          {t("sort")}
        </label>
        <select
          id="tutor-sort"
          value={value.sort}
          onChange={(e) =>
            patch({
              sort: e.target.value as TutorFilterState["sort"],
            })
          }
          className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        >
          <option value="rating">{t("sortRating")}</option>
          <option value="price_asc">{t("sortPriceAsc")}</option>
          <option value="price_desc">{t("sortPriceDesc")}</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            q: "",
            specialties: [],
            language: "",
            maxPrice: "",
            sort: "rating",
          })
        }
        className="min-h-11 text-sm text-zinc-300 underline-offset-4 hover:text-white hover:underline"
      >
        {t("reset")}
      </button>
    </div>
  )
}