import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt =
  "Korean Tutor Hub. Know the line, then say it yourself. Ojakgyo is free."
export const size = ogSize
export const contentType = ogContentType

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return renderOgImage(locale)
}
