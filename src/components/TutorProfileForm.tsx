"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { specialtyOptions } from "@/lib/specialties"

export type TutorProfileInitial = {
  display_name: string
  tagline: string
  bio: string
  hourly_rate: number | null
  specialties: string[]
}

export type TutorProfileFormProps = {
  tutorId: string
  initial: TutorProfileInitial
}

export default function TutorProfileForm({
  tutorId,
  initial,
}: TutorProfileFormProps) {
  const t = useTranslations("studio")
  const locale = useLocale()
  const router = useRouter()
  const supabase = createClient()

  const [displayName, setDisplayName] = useState(initial.display_name)
  const [tagline, setTagline] = useState(initial.tagline)
  const [bio, setBio] = useState(initial.bio)
  const [hourlyRate, setHourlyRate] = useState(
    initial.hourly_rate != null ? String(initial.hourly_rate) : ""
  )
  const [specialties, setSpecialties] = useState<string[]>(
    initial.specialties ?? []
  )
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const options = specialtyOptions(locale)

  function toggleSpecialty(code: string) {
    setSpecialties((prev) =>
      prev.includes(code) ? prev.filter((s) => s !== code) : [...prev, code]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    const rate = hourlyRate.trim() === "" ? null : Number(hourlyRate)

    const { error: updateError } = await supabase
      .from("tutors")
      .update({
        display_name: displayName.trim() || null,
        tagline: tagline.trim() || null,
        bio: bio.trim() || null,
        hourly_rate: rate != null && !Number.isNaN(rate) ? rate : null,
        specialties,
      })
      .eq("id", tutorId)

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setMessage(t("saved"))
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5">
          {t("displayName")}
        </label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          maxLength={40}
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-500 mb-1.5">
          {t("tagline")}
        </label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder={t("taglinePlaceholder")}
          className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          maxLength={80}
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-500 mb-1.5">{t("bio")}</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-500 mb-1.5">
          {t("hourlyRate")}
        </label>
        <input
          type="number"
          min={0}
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        />
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-2">{t("specialties")}</p>
        <div className="flex flex-wrap gap-2">
          {options.map((item) => {
            const active = specialties.includes(item.value)
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleSpecialty(item.value)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  active
                    ? "bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/40"
                    : "bg-white/5 text-zinc-400 border border-white/10"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? t("saving") : t("save")}
      </button>
    </form>
  )
}