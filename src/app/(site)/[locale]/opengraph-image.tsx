import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt =
  "Korean Tutor Hub. 좋아하는 노래로 튜터를 찾으세요. 오작교는 무료예요."
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
