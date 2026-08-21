"use client"

import { useState } from "react"

function initialFromBio(bio?: string | null) {
  if (!bio) return ""
  const match = bio.trim().match(/[A-Za-z가-힣]/)
  return match ? match[0].toUpperCase() : ""
}

const SIZE_CLASS = {
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
} as const

function Placeholder({
  bio,
  sizeClass,
}: {
  bio?: string | null
  sizeClass: string
}) {
  const initial = initialFromBio(bio)
  return (
    <div
      className={`${sizeClass} rounded-full bg-zinc-700/80 border border-white/15 shrink-0 flex items-center justify-center text-zinc-300 font-medium`}
      aria-hidden
    >
      {initial || null}
    </div>
  )
}

export default function Avatar({
  src,
  bio,
  size = "md",
}: {
  src?: string | null
  bio?: string | null
  size?: keyof typeof SIZE_CLASS
}) {
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null)
  const sizeClass = SIZE_CLASS[size]
  const failed = !src || brokenSrc === src

  if (failed) {
    return <Placeholder bio={bio} sizeClass={sizeClass} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setBrokenSrc(src)}
      className={`${sizeClass} rounded-full object-cover bg-white/10 border border-white/15 shrink-0`}
    />
  )
}
