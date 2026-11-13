"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import AvatarUpload from "@/components/AvatarUpload"

export default function ApplyTutorPage() {
  const t = useTranslations("apply")
  const locale = useLocale()
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("30000")
  const [specialties, setSpecialties] = useState("")
  const [languages, setLanguages] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setAuthed(Boolean(data.user))
      })
      .catch(() => setAuthed(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (!agreed) {
      setMessage(
        locale === "ko"
          ? "이용약관과 튜터 계약에 동의해 주세요."
          : "Please agree to the terms and tutor agreement."
      )
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage(locale === "ko" ? "로그인이 필요해요." : "Please log in.")
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
      agreed_at: new Date().toISOString(),
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage(t("success"))
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <Link
        href={`/${locale}/tutors`}
        className="mb-6 inline-flex min-h-11 items-center text-sm text-zinc-400"
      >
        ← {locale === "ko" ? "목록으로" : "Back to list"}
      </Link>

      <p className="kicker mb-2">{t("kicker")}</p>
      <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">{t("title")}</h1>
      <p className="mb-6 text-sm leading-relaxed text-zinc-400">{t("desc")}</p>

      <div className="mb-8 grid gap-3">
        <div className="surface p-5">
          <p className="kicker mb-1">{t("whoTitle")}</p>
          <p className="text-sm leading-relaxed text-zinc-300">{t("who")}</p>
        </div>
        <div className="surface p-5">
          <p className="kicker mb-1">{t("afterTitle")}</p>
          <p className="text-sm leading-relaxed text-zinc-300">{t("after")}</p>
        </div>
      </div>

      {authed === null && <div className="skeleton" aria-hidden="true" />}

      {authed === false && (
        <div className="surface p-6">
          <p className="text-sm leading-relaxed text-zinc-300">{t("gate")}</p>
          <Link href={`/${locale}/login`} className="btn btn-primary mt-4">
            {t("gateCta")}
          </Link>
        </div>
      )}

      {authed && (
      <form
        onSubmit={handleSubmit}
        className="surface space-y-4 p-6"
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
          <p className="text-xs text-zinc-500 mb-2">{t("bioHint")}</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("bioPlaceholder")}
            className="field h-36"
            required
            minLength={40}
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
            className="field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("specialties")}
          </label>
          <p className="text-xs text-zinc-500 mb-2">{t("specialtiesHint")}</p>
          <input
            type="text"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            placeholder={t("specialtiesHint")}
            className="field"
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
            className="field"
          />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-fuchsia-500"
            required
          />
          <span className="text-sm text-zinc-200">
            {locale === "ko" ? (
              <>
                <Link href={`/${locale}/terms`} className="accent underline">
                  이용약관
                </Link>
                {" · "}
                <Link href={`/${locale}/privacy`} className="accent underline">
                  개인정보처리방침
                </Link>
                그리고 튜터 이용계약(초안)에 동의해요.
              </>
            ) : (
              <>
                I agree to the{" "}
                <Link href={`/${locale}/terms`} className="accent underline">
                  Terms
                </Link>
                {", "}
                <Link href={`/${locale}/privacy`} className="accent underline">
                  Privacy Policy
                </Link>{" "}
                and the tutor agreement draft.
              </>
            )}
          </span>
        </label>

        {message && (
          <p className="text-sm text-center text-fuchsia-300">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading || !agreed}
          className="btn btn-primary btn-block"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>
      )}
    </div>
  )
}