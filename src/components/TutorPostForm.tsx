"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function TutorPostForm({ tutorId }: { tutorId: string }) {
  const t = useTranslations("studio")
  const router = useRouter()
  const supabase = createClient()

  const [type, setType] = useState<"post" | "notice">("post")
  const [body, setBody] = useState("")
  const [pinned, setPinned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return

    setLoading(true)
    setError(null)

    const { error: insertError } = await supabase.from("tutor_posts").insert({
      tutor_id: tutorId,
      type,
      body: body.trim(),
      media_type: "none",
      pinned: type === "notice" ? pinned : false,
      is_published: true,
    })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setBody("")
    setPinned(false)
    setType("post")
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("post")}
          className={`rounded-full px-3 py-1 text-xs ${
            type === "post"
              ? "bg-fuchsia-500/25 text-fuchsia-200"
              : "text-zinc-500 border border-white/10"
          }`}
        >
          {t("postTypePost")}
        </button>
        <button
          type="button"
          onClick={() => setType("notice")}
          className={`rounded-full px-3 py-1 text-xs ${
            type === "notice"
              ? "bg-amber-500/25 text-amber-200"
              : "text-zinc-500 border border-white/10"
          }`}
        >
          {t("postTypeNotice")}
        </button>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        required
        placeholder={t("postPlaceholder")}
        className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
      />

      {type === "notice" && (
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
          {t("pinNotice")}
        </label>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? t("posting") : t("publish")}
      </button>
    </form>
  )
}