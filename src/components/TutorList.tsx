"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import Avatar from "@/components/Avatar"
import TutorFilters, { type TutorFilterState } from "@/components/TutorFilters"
import { specialtyLabel } from "@/lib/specialties"

type TutorRow = {
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

export default function TutorList() {
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

  if (isLoading) {
    return <p className="text-zinc-400 text-sm py-8">{t("loading")}</p>
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

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm py-8 text-center">{t("empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((tutor) => (
            <Link
              key={tutor.id}
              href={`/tutors/${tutor.id}`}
              className="block rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-fuchsia-500/30 transition"
            >
              <div className="flex items-start gap-4">
                <Avatar src={tutor.avatar_url} bio={tutor.bio} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="text-white font-semibold truncate">
                      {tutor.display_name ||
                        (locale === "ko" ? "튜터" : "Tutor")}
                    </h2>
                    <span className="text-amber-400 text-sm font-medium shrink-0">
                      ★ {tutor.rating ?? "-"}
                    </span>
                  </div>

                  {tutor.tagline && (
                    <p className="text-fuchsia-300/90 text-sm mb-2 line-clamp-1">
                      {tutor.tagline}
                    </p>
                  )}

                  <p className="text-zinc-400 text-sm line-clamp-2 mb-3">
                    {tutor.bio}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                      {(tutor.specialties ?? []).map((code) => (
                        <span
                          key={code}
                          className="rounded-full bg-fuchsia-500/15 text-fuchsia-300 px-2.5 py-0.5 text-xs"
                        >
                          {specialtyLabel(code, locale)}
                        </span>
                      ))}
                    </div>
                    <span className="text-fuchsia-400 text-sm font-semibold shrink-0">
                      {tutor.hourly_rate != null
                        ? `${tutor.hourly_rate.toLocaleString()}${
                            locale === "ko" ? "원" : ""
                          }`
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}