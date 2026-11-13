import { ImageResponse } from "next/og"

export function renderMark(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          color: "#f5d0fe",
          fontSize: Math.round(size * 0.62),
          fontWeight: 700,
        }}
      >
        K
      </div>
    ),
    { width: size, height: size }
  )
}
