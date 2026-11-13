"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function TutorBookingActions({
  bookingId,
  status,
}: {
  bookingId: string
  status: string
}) {
  const t = useTranslations("booking")
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateStatus(next: "confirmed" | "cancelled" | "completed") {
    setLoading(true)
    setError(null)
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: next,
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
      <div className="flex flex-wrap gap-2">
        {status === "pending" && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={() => updateStatus("confirmed")}
              className="btn btn-primary flex-1"
            >
              {t("confirmBooking")}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => updateStatus("cancelled")}
              className="btn btn-danger flex-1"
            >
              {t("declineBooking")}
            </button>
          </>
        )}
        {status === "confirmed" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => updateStatus("completed")}
            className="btn btn-primary flex-1"
          >
            {t("markCompleted")}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  )
}