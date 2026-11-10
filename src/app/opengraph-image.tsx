import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt =
  "Korean Tutor Hub. Find a Korean tutor and start with the lyrics. Ojakgyo is free and not part of a package."
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage("en")
}
