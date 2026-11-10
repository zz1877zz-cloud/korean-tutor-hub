import { createClient } from "@/lib/supabase/server"
import { ogContentType, ogSize, renderTutorOg } from "@/lib/og-image"

export const alt = "Korean Tutor Hub 튜터. 오작교는 무료예요."
export const size = ogSize
export const contentType = ogContentType

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  let name: string | null = null
  let tagline: string | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("tutors")
      .select("display_name, tagline")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle()
    name = data?.display_name ?? null
    tagline = data?.tagline ?? null
  } catch {
    // The card still renders when the profile cannot be read.
  }

  return renderTutorOg({ locale, name, tagline })
}
