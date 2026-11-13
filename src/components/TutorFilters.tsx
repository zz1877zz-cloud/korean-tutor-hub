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
    <div className="surface space-y-4 p-5">
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
          className="field"
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
                className={active ? "chip-btn is-on" : "chip-btn"}
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
            className="field"
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
            className="field"
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
          className="field"
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