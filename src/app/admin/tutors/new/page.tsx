"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewTutorPage() {
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("30000")
  const [specialties, setSpecialties] = useState("회화, 토픽")
  const [languages, setLanguages] = useState("한국어, 영어")
  const [rating, setRating] = useState("4.5")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      setIsAdmin(false)
      setChecking(false)
      return
    }

    setIsAdmin(true)
    setChecking(false)
  }

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
      rating: Number(rating),
      is_active: true,
    })

    if (error) {
      setMessage("등록 실패: " + error.message)
      setLoading(false)
      return
    }

    setMessage("튜터 등록 완료!")
    setLoading(false)
    setTimeout(() => router.push("/tutors"), 1000)
  }

  if (checking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-zinc-400">
        권한 확인 중...
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 mb-4">관리자만 접근할 수 있습니다.</p>
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

      <h1 className="text-2xl font-bold mb-6 text-white">튜터 직접 등록 (관리자)</h1>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">소개글</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 h-28 text-white focus:outline-none focus:border-fuchsia-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">시간당 요금 (원)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-fuchsia-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">전문 분야 (쉼표로 구분)</label>
          <input
            type="text"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">가능 언어 (쉼표로 구분)</label>
          <input
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">평점</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
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
          {loading ? "등록 중..." : "튜터 등록"}
        </button>
      </form>
    </div>
  )
}