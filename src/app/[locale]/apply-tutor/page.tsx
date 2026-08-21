"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import AvatarUpload from "@/components/AvatarUpload"

export default function ApplyTutorPage() {
  const t = useTranslations("apply")
  const locale = useLocale()
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("30000")
  const [specialties, setSpecialties] = useState("회화, 토픽")
  const [languages, setLanguages] = useState("한국어, 영어")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push(`/${locale}/login`)
        return
      }
      setReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage(locale === "ko" ? "로그인이 필요합니다." : "Please log in.")
      setLoading(false)
      return
    }

    const specialtyArray = specialties.split(",").map((s) => s.trim()).filter(Boolean)
    const languageArray = languages.split(",").map((s) => s.trim()).filter(Boolean)

    const { error } = await supabase.from("tutor_applications").insert({
      user_id: user.id,
      bio,
      hourly_rate: Number(hourlyRate),
      specialties: specialtyArray,
      languages: languageArray,
      status: "pending",
      avatar_url: avatarUrl,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage(t("success"))
    setLoading(false)
  }

  if (!ready) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-zinc-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link
        href={`/${locale}/tutors`}
        className="text-zinc-400 hover:text-white transition mb-6 inline-block text-sm"
      >
        ← {locale === "ko" ? "목록으로" : "Back to list"}
      </Link>

      <h1 className="text-2xl font-bold mb-2 text-white">{t("title")}</h1>
      <p className="text-zinc-400 text-sm mb-6">{t("desc")}</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4"
      >
        <AvatarUpload
          value={avatarUrl}
          bio={bio}
          onUploaded={setAvatarUrl}
          label={t("photo")}
          hint={t("photoHint")}
          changeLabel={t("photoChange")}
          uploadingLabel={t("photoUploading")}
        />

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("bio")}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 h-28 text-white focus:outline-none focus:border-fuchsia-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("rate")}
          </label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-fuchsia-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("specialties")}
          </label>
          <input
            type="text"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("languages")}
          </label>
          <input
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>

        {message && (
          <p className="text-sm text-center text-fuchsia-300">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-3 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  )
}