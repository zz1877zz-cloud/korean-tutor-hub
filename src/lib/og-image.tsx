import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

const noto = readFileSync(join(process.cwd(), "src/assets/NotoSansKR-Medium.woff"))

const fonts = [
  {
    name: "Noto Sans KR",
    data: noto,
    weight: 500 as const,
    style: "normal" as const,
  },
]

function frame(lines: { eyebrow: string; title: string; subtitle: string; note: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0f",
          color: "#fafafa",
          padding: "72px",
          fontFamily: "Noto Sans KR",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "18px",
              height: "64px",
              borderRadius: "999px",
              background: "linear-gradient(180deg, #e879f9, #7c3aed)",
            }}
          />
          <div style={{ fontSize: "28px", letterSpacing: "0.08em", color: "#f0abfc" }}>
            {lines.eyebrow}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: "68px", lineHeight: 1.15 }}>{lines.title}</div>
          <div style={{ fontSize: "32px", color: "#e4e4e7", lineHeight: 1.35 }}>
            {lines.subtitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            border: "2px solid rgba(232,121,249,0.8)",
            borderRadius: "999px",
            padding: "12px 22px",
            fontSize: "28px",
            color: "#fae8ff",
          }}
        >
          {lines.note}
        </div>
      </div>
    ),
    { ...ogSize, fonts }
  )
}

export function renderOgImage(locale: string) {
  const ko = locale === "ko"
  return frame({
    eyebrow: "KOREAN TUTOR HUB",
    title: ko ? "좋아하는 노래로 튜터를 찾으세요." : "Find a Korean tutor.",
    subtitle: ko
      ? "오작교는 무료예요. 어떤 상품에도 들어 있지 않아요."
      : "Start with a song you love. Ojakgyo stays free.",
    note: ko ? "무료 상담 · 상품에 포함되지 않음" : "Free consult · not part of any package",
  })
}

export function renderTutorOg({
  locale,
  name,
  tagline,
}: {
  locale: string
  name?: string | null
  tagline?: string | null
}) {
  const ko = locale === "ko"
  const title = name?.trim() || (ko ? "튜터" : "Tutor")
  const subtitle =
    tagline?.trim() ||
    (ko
      ? "오작교는 무료예요. 수업 전에 먼저 대화해요."
      : "Ojakgyo is free. Talk before you book a lesson.")
  return frame({
    eyebrow: ko ? "튜터 · KOREAN TUTOR HUB" : "TUTOR · KOREAN TUTOR HUB",
    title,
    subtitle,
    note: ko ? "오작교는 무료 · 상품에 포함되지 않음" : "Ojakgyo is free · not part of a package",
  })
}
