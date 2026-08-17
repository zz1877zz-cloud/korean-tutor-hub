"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const REASONS = [
  { value: "schedule", label: "일정 변경" },
  { value: "tutor", label: "튜터 변경 희망" },
  { value: "personal", label: "개인 사정" },
  { value: "other", label: "기타" },
]

export default function BookingActions({
  bookingId,
  status,
}: {
  bookingId: string
  status: string
}) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("schedule")
  const [custom, setCustom] = useState("")
  const router = useRouter()

  async function handleCancel() {
    const finalReason =
      reason === "other"
        ? custom.trim() || "기타"
        : REASONS.find((r) => r.value === reason)?.label || reason

    setLoading(true)

    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "cancelled",
        cancel_reason: finalReason,
      }),
    })

    setLoading(false)

    if (res.ok) {
      setOpen(false)
      router.refresh()
    } else {
      alert("취소에 실패했습니다.")
    }
  }

  if (status === "cancelled" || status === "completed") {
    return null
  }

  if (status !== "pending") {
    return null
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm px-3 py-1.5 border border-red-500/40 text-red-300 rounded-full hover:bg-red-500/10 transition"
        >
          예약 취소
        </button>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <p className="text-sm text-zinc-300">취소 사유를 선택해주세요</p>

          <div className="flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setReason(r.value)}
                className={`text-xs px-3 py-1.5 rounded-full transition ${
                  reason === r.value
                    ? "bg-fuchsia-600 text-white"
                    : "bg-white/5 text-zinc-400 border border-white/10"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {reason === "other" && (
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="사유를 입력하세요"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500/50"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="text-sm px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 disabled:opacity-50"
            >
              {loading ? "처리 중..." : "취소 확정"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-sm px-4 py-2 border border-white/15 text-zinc-400 rounded-full"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}