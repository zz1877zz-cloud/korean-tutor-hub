"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Avatar from "@/components/Avatar"

type Application = {
  id: string
  bio: string
  specialties: string[]
  languages: string[]
  hourly_rate: number
  status: string
  created_at: string
  user_id: string
  avatar_url: string | null
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAdminAndLoad()
  }, [])

  async function checkAdminAndLoad() {
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
      setMessage("관리자만 접근할 수 있습니다.")
      setLoading(false)
      return
    }

    setIsAdmin(true)

    const { data, error } = await supabase
      .from("tutor_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setApps(data)
    }
    setLoading(false)
  }

  async function handleApprove(app: Application) {
    setMessage("처리 중...")

    // 1. tutors 테이블에 등록
    const { error: insertError } = await supabase.from("tutors").insert({
      user_id: app.user_id,
      bio: app.bio,
      specialties: app.specialties,
      languages: app.languages,
      hourly_rate: app.hourly_rate,
      rating: 0,
      is_active: true,
      avatar_url: app.avatar_url || null,
    })

    if (insertError) {
      setMessage("등록 실패: " + insertError.message)
      return
    }

    // 2. 신청 상태 변경
    const { error: updateError } = await supabase
      .from("tutor_applications")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", app.id)

    if (updateError) {
      setMessage("상태 변경 실패: " + updateError.message)
      return
    }

    // 3. 프로필 role을 tutor로 변경 (선택)
    await supabase
      .from("profiles")
      .update({ role: "tutor" })
      .eq("id", app.user_id)

    setMessage("승인 완료! 튜터 목록에 등록되었습니다.")
    checkAdminAndLoad()
  }

  async function handleReject(app: Application) {
    setMessage("처리 중...")

    const { error } = await supabase
      .from("tutor_applications")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", app.id)

    if (error) {
      setMessage("거절 실패: " + error.message)
      return
    }

    setMessage("거절 처리되었습니다.")
    checkAdminAndLoad()
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-zinc-400">
        로딩 중...
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 mb-4">{message || "접근 권한이 없습니다."}</p>
        <Link href="/" className="text-violet-400 hover:text-violet-300">
          홈으로
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">튜터 신청 관리</h1>
        <Link
          href="/admin/tutors/new"
          className="text-sm text-fuchsia-400 hover:text-fuchsia-300"
        >
          직접 등록 →
        </Link>
      </div>

      {message && (
        <p className="text-sm text-fuchsia-300 mb-4">{message}</p>
      )}

      <div className="space-y-4">
        {apps.map((app) => (
          <div
            key={app.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  app.status === "pending"
                    ? "bg-amber-500/20 text-amber-300"
                    : app.status === "approved"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {app.status === "pending" && "대기중"}
                {app.status === "approved" && "승인됨"}
                {app.status === "rejected" && "거절됨"}
              </span>
              <span className="text-xs text-zinc-500">
                {new Date(app.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>

            <div className="flex items-start gap-3 mb-3">
              <Avatar src={app.avatar_url} bio={app.bio} size="md" />
              <p className="text-zinc-300 text-sm line-clamp-3 flex-1">{app.bio}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {app.specialties?.map((s) => (
                <span key={s} className="text-xs bg-fuchsia-500/15 text-fuchsia-300 px-2 py-0.5 rounded-full">
                  {s}
                </span>
              ))}
            </div>

            <p className="text-fuchsia-400 text-sm font-medium mb-4">
              {app.hourly_rate?.toLocaleString()}원/시간
            </p>

            {app.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(app)}
                  className="text-sm px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition"
                >
                  승인
                </button>
                <button
                  onClick={() => handleReject(app)}
                  className="text-sm px-4 py-2 border border-red-500/40 text-red-300 rounded-full hover:bg-red-500/10 transition"
                >
                  거절
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {apps.length === 0 && (
        <p className="text-zinc-500 text-center py-12">신청 내역이 없습니다.</p>
      )}
    </div>
  )
}