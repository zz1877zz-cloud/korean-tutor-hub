"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Tutor = {
  id: string
  bio: string
  specialties: string[]
  hourly_rate: number
  rating: number
  is_active: boolean
  created_at: string
  user_id: string | null
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAndLoad()
  }, [])

  async function checkAndLoad() {
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
      setLoading(false)
      return
    }

    setIsAdmin(true)

    const { data } = await supabase
      .from("tutors")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setTutors(data)
    setSelected(new Set())
    setLoading(false)
  }

  // bio 앞 40자로 중복 그룹 판별
  const duplicateIds = useMemo(() => {
    const map = new Map<string, string[]>()
    tutors.forEach((t) => {
      const key = (t.bio || "").trim().slice(0, 40).toLowerCase()
      if (!key) return
      const list = map.get(key) || []
      list.push(t.id)
      map.set(key, list)
    })
    const ids = new Set<string>()
    map.forEach((list) => {
      if (list.length > 1) list.forEach((id) => ids.add(id))
    })
    return ids
  }, [tutors])

  const visibleTutors = showDuplicatesOnly
    ? tutors.filter((t) => duplicateIds.has(t.id))
    : tutors

  const allVisibleSelected =
    visibleTutors.length > 0 &&
    visibleTutors.every((t) => selected.has(t.id))

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        visibleTutors.forEach((t) => next.delete(t.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        visibleTutors.forEach((t) => next.add(t.id))
        return next
      })
    }
  }

  async function bulkSetActive(active: boolean) {
    if (selected.size === 0) {
      setMessage("선택된 튜터가 없습니다.")
      return
    }
    setMessage("처리 중...")

    const ids = Array.from(selected)
    const { error } = await supabase
      .from("tutors")
      .update({ is_active: active })
      .in("id", ids)

    if (error) {
      setMessage("실패: " + error.message)
      return
    }

    setMessage(
      active
        ? `${ids.length}명 활성화 완료`
        : `${ids.length}명 비활성화 완료 (목록에서 숨김)`
    )
    checkAndLoad()
  }

  async function bulkDelete() {
    if (selected.size === 0) {
      setMessage("선택된 튜터가 없습니다.")
      return
    }
    if (!confirm(`선택한 ${selected.size}명을 정말 삭제할까요? 복구할 수 없습니다.`)) {
      return
    }

    setMessage("삭제 중...")
    const ids = Array.from(selected)
    const { error } = await supabase.from("tutors").delete().in("id", ids)

    if (error) {
      setMessage("삭제 실패: " + error.message)
      return
    }

    setMessage(`${ids.length}명 삭제 완료`)
    checkAndLoad()
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
        <p className="text-red-400 mb-4">관리자만 접근할 수 있습니다.</p>
        <Link href="/" className="text-violet-400 hover:text-violet-300">
          홈으로
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">튜터 관리</h1>
        <div className="flex gap-3 text-sm">
          <Link href="/admin/applications" className="text-zinc-400 hover:text-white">
            신청 관리
          </Link>
          <Link href="/admin/tutors/new" className="text-fuchsia-400 hover:text-fuchsia-300">
            직접 등록
          </Link>
        </div>
      </div>

      {/* 도구 바 */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleAllVisible}
              className="rounded"
            />
            전체 선택 ({visibleTutors.length})
          </label>

          <button
            onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              showDuplicatesOnly
                ? "border-amber-500/50 text-amber-300 bg-amber-500/10"
                : "border-white/15 text-zinc-400 hover:text-white"
            }`}
          >
            중복만 보기 ({duplicateIds.size}명)
          </button>

          <span className="text-xs text-zinc-500">
            선택됨 {selected.size}명
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => bulkSetActive(false)}
            className="text-sm px-3 py-1.5 rounded-full border border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
          >
            선택 비활성화
          </button>
          <button
            onClick={() => bulkSetActive(true)}
            className="text-sm px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
          >
            선택 활성화
          </button>
          <button
            onClick={bulkDelete}
            className="text-sm px-3 py-1.5 rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10"
          >
            선택 삭제
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-fuchsia-300 mb-4">{message}</p>}

      <div className="space-y-4">
        {visibleTutors.map((tutor) => {
          const isDup = duplicateIds.has(tutor.id)
          return (
            <div
              key={tutor.id}
              className={`bg-white/5 border rounded-3xl p-6 ${
                isDup ? "border-amber-500/40" : "border-white/10"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selected.has(tutor.id)}
                  onChange={() => toggleOne(tutor.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          tutor.is_active
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-zinc-500/20 text-zinc-400"
                        }`}
                      >
                        {tutor.is_active ? "활성" : "비활성"}
                      </span>
                      {isDup && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                          중복 의심
                        </span>
                      )}
                    </div>
                    <span className="text-amber-400 text-sm">★ {tutor.rating}</span>
                  </div>

                  <p className="text-zinc-300 text-sm mb-3 line-clamp-2">{tutor.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {tutor.specialties?.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-fuchsia-500/15 text-fuchsia-300 px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-fuchsia-400 text-sm font-medium">
                    {tutor.hourly_rate?.toLocaleString()}원/시간
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {visibleTutors.length === 0 && (
        <p className="text-zinc-500 text-center py-12">
          {showDuplicatesOnly ? "중복으로 보이는 튜터가 없습니다." : "등록된 튜터가 없습니다."}
        </p>
      )}
    </div>
  )
}