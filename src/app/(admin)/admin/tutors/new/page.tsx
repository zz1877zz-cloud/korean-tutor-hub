"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AvatarUpload from "@/components/AvatarUpload"

export default function NewTutorPage() {
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("30000")
  const [specialties, setSpecialties] = useState("회화, 토픽")
  const [languages, setLanguages] = useState("한국어, 영어")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return
      const user = data.user
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (cancelled) return
      if (profile?.role !== "admin") {
        setIsAdmin(false)
        setChecking(false)
        return
      }

      setIsAdmin(true)
      setChecking(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const specialtyArray = specialties.split(",").map((s) => s.trim()).filter(Boolean)
    const languageArray = languages.split(",").map((s) => s.trim()).filter(Boolean)

    const { error } = await supabase.from("tutors").insert({
      bio,
      hourly_rate: Number(hourlyRate),
      specialties: specialtyArray,
      languages: languageArray,
      rating: null,
      is_active: true,
      avatar_url: avatarUrl,
    })

    if (error) {
      setMessage("등록하지 못했어요: " + error.message)
      setLoading(false)
      return
    }

    setMessage("튜터를 등록했어요.")
    setLoading(false)
    setTimeout(() => router.push("/tutors"), 1000)
  }

  if (checking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-zinc-400">
        권한을 확인하는 중…
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 mb-4">관리자만 들어올 수 있어요.</p>
        <Link href="/" className="text-violet-400 hover:text-violet-300">
          홈으로
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/admin/applications" className="text-zinc-400 hover:text-white transition mb-6 inline-block text-sm">
        ← 신청 관리로
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-white">튜터 직접 등록</h1>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="pb-2 border-b border-white/10">
          <AvatarUpload
            value={avatarUrl}
            bio={bio}
            onUploaded={setAvatarUrl}
            size="xl"
            label="프로필 사진"
            hint="JPG, PNG, WebP / 최대 5MB"
            changeLabel="사진 선택"
            uploadingLabel="업로드 중..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">소개글</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">시급 (원)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">전문 분야 (쉼표로 구분)</label>
          <input
            type="text"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">가능 언어 (쉼표로 구분)</label>
          <input
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="field"
          />
        </div>

        <p className="text-sm leading-relaxed text-zinc-300">
          평점은 넣지 않아요. 리뷰가 생기기 전에는 별점을 비워 둬요.
        </p>

        {message && (
          <p className="text-sm text-center text-fuchsia-300">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-block"
        >
          {loading ? "등록 중..." : "튜터 등록"}
        </button>
      </form>
    </div>
  )
}