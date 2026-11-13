"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useLocale, useTranslations } from "next-intl"
import TutorCard, { type TutorCardLabels } from "@/components/TutorCard"
import TutorFilters, { type TutorFilterState } from "@/components/TutorFilters"

export type TutorRow = {
  id: string
  bio: string | null
  display_name: string | null
  tagline: string | null
  specialties: string[] | null
  languages: string[] | null
  hourly_rate: number | null
  rating: number | null
  avatar_url: string | null
  is_active: boolean | null
}

export default function TutorList({
  initialTutors,
}: {
  initialTutors: TutorRow[]
}) {
  const t = useTranslations("tutors")
  const locale = useLocale()
  const [filters, setFilters] = useState<TutorFilterState>({
    q: "",
    specialties: [],
    language: "",
    maxPrice: "",
    sort: "rating",
  })

  const { data: tutors, isLoading, error } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("tutors")
        .select(
          "id, bio, display_name, tagline, specialties, languages, hourly_rate, rating, avatar_url, is_active"
        )
        .eq("is_active", true)

      if (error) throw error
      return (data ?? []) as TutorRow[]
    },
    initialData: initialTutors,
  })

  const filtered = useMemo(() => {
    let list = [...(tutors ?? [])]

    const q = filters.q.trim().toLowerCase()
    if (q) {
      list = list.filter((tutor) => {
        const hay = [
          tutor.bio ?? "",
          tutor.display_name ?? "",
          tutor.tagline ?? "",
        ]
          .join(" ")
          .toLowerCase()
        return hay.includes(q)
      })
    }

    if (filters.specialties.length > 0) {
      list = list.filter((tutor) =>
        filters.specialties.every((code) =>
          (tutor.specialties ?? []).includes(code)
        )
      )
    }

    if (filters.language) {
      list = list.filter((tutor) =>
        (tutor.languages ?? []).some(
          (lang) =>
            lang.toLowerCase() === filters.language.toLowerCase() ||
            lang.toLowerCase().startsWith(filters.language.toLowerCase())
        )
      )
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice)
      if (!Number.isNaN(max)) {
        list = list.filter(
          (tutor) => tutor.hourly_rate != null && tutor.hourly_rate <= max
        )
      }
    }

    if (filters.sort === "rating") {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    } else if (filters.sort === "price_asc") {
      list.sort((a, b) => (a.hourly_rate ?? 0) - (b.hourly_rate ?? 0))
    } else if (filters.sort === "price_desc") {
      list.sort((a, b) => (b.hourly_rate ?? 0) - (a.hourly_rate ?? 0))
    }

    return list
  }, [tutors, filters])

  const labels: TutorCardLabels = {
    unnamed: t("unnamed"),
    reviewsPending: t("reviewsPending"),
    rateUnset: t("rateUnset"),
    languagesLabel: t("languagesLabel"),
    languagesUnset: t("languagesUnset"),
    bioUnset: t("bioUnset"),
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-live="polite">
        <p className="sr-only">{t("loading")}</p>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="skeleton animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-rose-400 text-sm py-8">
        {error instanceof Error ? error.message : t("loadError")}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <TutorFilters value={filters} onChange={setFilters} />

      <p className="text-sm text-zinc-300">{t("resultCount", { count: filtered.length })}</p>

      {filtered.length === 0 ? (
        <p className="surface px-4 py-8 text-center text-sm leading-relaxed text-zinc-300">
          {t("empty")}
        </p>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
          {filtered.map((tutor) => (
            <li key={tutor.id}>
              <TutorCard tutor={tutor} locale={locale} labels={labels} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}