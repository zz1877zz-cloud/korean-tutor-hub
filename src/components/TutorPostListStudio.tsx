"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"

type Post = {
  id: string
  type: string
  body: string
  pinned: boolean
  created_at: string
}

export default function TutorPostListStudio({ posts }: { posts: Post[] }) {
  const t = useTranslations("studio")
  const router = useRouter()
  const supabase = createClient()
  const [busyId, setBusyId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setBusyId(id)
    await supabase.from("tutor_posts").delete().eq("id", id)
    setBusyId(null)
    router.refresh()
  }

  if (!posts.length) {
    return <p className="text-sm text-zinc-500 py-4">{t("postsEmpty")}</p>
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs rounded-full px-2 py-0.5 ${
                  post.type === "notice"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-white/10 text-zinc-400"
                }`}
              >
                {post.type === "notice"
                  ? t("postTypeNotice")
                  : t("postTypePost")}
              </span>
              {post.pinned && (
                <span className="text-xs text-amber-400">{t("pinned")}</span>
              )}
            </div>
            <button
              type="button"
              disabled={busyId === post.id}
              onClick={() => handleDelete(post.id)}
              className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-50"
            >
              {t("delete")}
            </button>
          </div>
          <p className="text-sm text-zinc-200 whitespace-pre-line">{post.body}</p>
          <p className="text-xs text-zinc-600 mt-2">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}