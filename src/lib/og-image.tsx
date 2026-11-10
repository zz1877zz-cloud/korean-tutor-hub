import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

export function renderOgImage(locale: string) {
  const ko = locale === "ko"
  const eyebrow = "KOREAN TUTOR HUB"
  const title = "Find a Korean tutor."
  const subtitle = ko
    ? "Start with a song you love. Ojakgyo stays free."
    : "Start with a song you love. Ojakgyo stays free."
  const note = ko
    ? "Free consult · not part of any package · EN / KO"
    : "Free consult · not part of any package · EN / KO"

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
          fontFamily: "sans-serif",
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
          <div
            style={{
              fontSize: "28px",
              letterSpacing: "0.14em",
              color: "#f0abfc",
            }}
          >
            {eyebrow}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "84px", fontWeight: 700, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ fontSize: "36px", color: "#e4e4e7", lineHeight: 1.3 }}>
            {subtitle}
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
          {note}
        </div>
      </div>
    ),
    { ...ogSize }
  )
}
