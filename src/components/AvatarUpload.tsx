"use client"

import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Avatar from "@/components/Avatar"

const BUCKET = "tutor-avatars"
const MAX_BYTES = 5 * 1024 * 1024
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif"

type Props = {
  /** When set, upload then write `tutors.avatar_url` immediately. */
  tutorId?: string | null
  value?: string | null
  bio?: string | null
  onUploaded?: (url: string) => void
  size?: "sm" | "md" | "lg" | "xl"
  compact?: boolean
  label?: string
  hint?: string
  changeLabel?: string
  uploadingLabel?: string
}

export default function AvatarUpload({
  tutorId,
  value,
  bio,
  onUploaded,
  size = "lg",
  compact = false,
  label = "프로필 사진",
  hint = "JPG, PNG, WebP / 최대 5MB",
  changeLabel = "사진 선택",
  uploadingLabel = "업로드 중...",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const shown = preview || value || null

  async function handleFile(file: File) {
    setError("")

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일을 선택해주세요.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError("이미지는 5MB 이하여야 합니다.")
      return
    }

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setBusy(true)

    const path = tutorId
      ? `${tutorId}/avatar`
      : `pending/${crypto.randomUUID()}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      })

    if (uploadError) {
      setError(uploadError.message)
      setBusy(false)
      return
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`

    if (tutorId) {
      const { error: updateError } = await supabase
        .from("tutors")
        .update({ avatar_url: publicUrl })
        .eq("id", tutorId)

      if (updateError) {
        setError(updateError.message)
        setBusy(false)
        return
      }
    }

    onUploaded?.(publicUrl)
    setBusy(false)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (file) void handleFile(file)
  }

  if (compact) {
    return (
      <div className="shrink-0 flex flex-col items-center gap-1">
        <label className="relative block cursor-pointer rounded-full hover:ring-2 hover:ring-fuchsia-500/50">
          <Avatar src={shown} bio={bio} size={size} />
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            disabled={busy}
            onChange={onInputChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={changeLabel}
          />
        </label>
        <span className="text-[10px] text-zinc-400">
          {busy ? uploadingLabel : changeLabel}
        </span>
        {error && (
          <p className="text-[10px] text-red-400 max-w-20 text-center">{error}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <p className="block text-sm font-medium text-zinc-300">{label}</p>
      )}
      <div className="flex items-center gap-4">
        <div className={!shown ? "rounded-full ring-2 ring-dashed ring-white/25" : ""}>
          <Avatar src={shown} bio={bio} size={size} />
        </div>
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            disabled={busy}
            onChange={onInputChange}
            className="block w-full text-sm text-zinc-300
              file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0
              file:bg-fuchsia-600 file:text-white file:font-medium
              file:cursor-pointer hover:file:opacity-90
              disabled:opacity-50"
          />
          <p className="text-xs text-zinc-500 mt-1.5">
            {busy ? uploadingLabel : hint}
          </p>
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
