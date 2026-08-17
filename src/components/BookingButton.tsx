"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

export default function BookingButton({ tutorId }: { tutorId: string }) {
  const t = useTranslations("detail")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [ok, setOk] = useState(false)

  async function handleBooking() {
    setLoading(true)
    setMessage("")
    setOk(false)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutor_id: tutorId,
          note: "Trial lesson request",
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setMessage(result.error || t("bookFail"))
      } else {
        setOk(true)
        setMessage(t("bookSuccess"))
      }
    } catch {
      setMessage(t("bookFail"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-3.5 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? t("booking") : t("book")}
      </button>

      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            ok ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
