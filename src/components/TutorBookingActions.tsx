"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function TutorBookingActions({
  bookingId,
}: {
  bookingId: string
}) {
  const t = useTranslations("booking")
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateStatus(status: "confirmed" | "cancelled") {
    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("confirmed")}
          className="flex-1 rounded-full bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {t("confirmBooking")}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("cancelled")}
          className="flex-1 rounded-full border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
        >
          {t("declineBooking")}
        </button>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  )
}