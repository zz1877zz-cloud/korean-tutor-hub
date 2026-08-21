"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import TutorFilters from "@/components/TutorFilters"
import Avatar from "@/components/Avatar"

type Tutor = {
  id: string
  bio: string
  specialties: string[]
  languages: string[]
  hourly_rate: number
  rating: number
  is_active: boolean
  avatar_url: string | null
}

type Props = {
  locale: string
  title: string
  searchPlaceholder: string
  searchLabel: string
  noResults: string
  viewDetail: string
  perHour: string
  loadError: string
  initialQuery?: string
}

export default function TutorList({
  locale,
  title,
  searchPlaceholder,
  searchLabel,
  noResults,
  viewDetail,
  perHour,
  loadError,
  initialQuery = "",
}: Props) {
  const [q, setQ] = useState(initialQuery)
  const [filters, setFilters] = useState({
    specialty: "",
    price: "",
    language: "",
    sort: "rating",
  })

  const { data: tutors, isLoading, error } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .eq("is_active", true)

      if (error) throw error
      return (data || []) as Tutor[]
    },
  })

  const filtered = useMemo(() => {
    let list = tutors || []

    if (q.trim()) {
      const keyword = q.toLowerCase()
      list = list.filter(
        (t) =>
          t.bio?.toLowerCase().includes(keyword) ||
          t.specialties?.some((s) => s.toLowerCase().includes(keyword))
      )
    }

    if (filters.specialty) {
      list = list.filter((t) =>
        t.specialties?.some((s) =>
          s.toLowerCase().includes(filters.specialty.toLowerCase())
        )
      )
    }

    if (filters.price) {
      const [min, max] = filters.price.split("-").map(Number)
      list = list.filter(
        (t) => t.hourly_rate >= min && t.hourly_rate <= max
      )
    }

    if (filters.language) {
      list = list.filter((t) =>
        t.languages?.some((l) =>
          l.toLowerCase().includes(filters.language.toLowerCase())
        )
      )
    }

    list = [...list].sort((a, b) => {
      if (filters.sort === "price_asc") return a.hourly_rate - b.hourly_rate
      if (filters.sort === "price_desc") return b.hourly_rate - a.hourly_rate
      return (b.rating || 0) - (a.rating || 0)
    })

    return list
  }, [tutors, q, filters])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const input = form.elements.namedItem("q") as HTMLInputElement
            setQ(input.value)
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder={searchPlaceholder}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 w-56 text-white placeholder:text-zinc-500 focus:outline-none focus:border-fuchsia-500/50"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition"
          >
            {searchLabel}
          </button>
        </form>
      </div>

      <TutorFilters
        filters={filters}
        onChange={setFilters}
        locale={locale}
      />

      {isLoading && (
        <p className="text-zinc-500 text-center py-12">Loading...</p>
      )}

      {error && <p className="text-red-400 mb-4">{loadError}</p>}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-fuchsia-500/30 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar src={tutor.avatar_url} bio={tutor.bio} size="md" />
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="text-amber-400 font-medium">
                      ★ {tutor.rating}
                    </span>
                    <span className="text-fuchsia-400 font-semibold text-sm">
                      {tutor.hourly_rate?.toLocaleString()}
                      {locale === "ko" ? "원" : " KRW"}
                      {perHour}
                    </span>
                  </div>
                </div>

                <p className="text-zinc-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {tutor.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {tutor.specialties?.map((item) => (
                    <span
                      key={item}
                      className="text-xs bg-fuchsia-500/15 text-fuchsia-300 px-2.5 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/${locale}/tutors/${tutor.id}`}
                  className="text-sm text-violet-300 hover:text-violet-200 font-medium transition"
                >
                  {viewDetail}
                </Link>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-zinc-500 text-center py-12">{noResults}</p>
          )}
        </>
      )}
    </div>
  )
}