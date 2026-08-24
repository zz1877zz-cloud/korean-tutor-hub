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
        <label className="block text-xs text-zinc-500 mb-1.5">
          {t("search")}
        </label>
        <input
          type="search"
          value={value.q}
          onChange={(e) => patch({ q: e.target.value })}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        />
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-2">{t("specialty")}</p>
        <div className="flex flex-wrap gap-2">
          {specialties.map((item) => {
            const active = value.specialties.includes(item.value)
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleSpecialty(item.value)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  active
                    ? "bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/40"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">
            {t("language")}
          </label>
          <select
            value={value.language}
            onChange={(e) => patch({ language: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          >
            <option value="">{t("languageAll")}</option>
            <option value="ko">{t("languageKo")}</option>
            <option value="en">{t("languageEn")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">
            {t("maxPrice")}
          </label>
          <input
            type="number"
            min={0}
            value={value.maxPrice}
            onChange={(e) => patch({ maxPrice: e.target.value })}
            placeholder={t("maxPricePlaceholder")}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-zinc-500 mb-1.5">
          {t("sort")}
        </label>
        <select
          value={value.sort}
          onChange={(e) =>
            patch({
              sort: e.target.value as TutorFilterState["sort"],
            })
          }
          className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
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
        className="text-xs text-zinc-500 hover:text-zinc-300 transition"
      >
        {t("reset")}
      </button>
    </div>
  )
}