import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { logQueryFailure } from "@/lib/supabase-log"
import { SITE_URL } from "@/lib/seo"

const locales = ["ko", "en"] as const
const paths = ["", "/tutors", "/apply-tutor", "/terms", "/privacy", "/fees"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: path === "" || path === "/tutors" ? "daily" : "weekly",
      priority: path === "" ? 1 : path === "/tutors" ? 0.9 : 0.5,
      alternates: {
        languages: {
          ko: `${SITE_URL}/ko${path}`,
          en: `${SITE_URL}/en${path}`,
          "x-default": `${SITE_URL}/en${path}`,
        },
      },
    }))
  ) satisfies MetadataRoute.Sitemap

  let tutorPages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("tutors")
      .select("id")
      .eq("is_active", true)
    if (error) logQueryFailure("sitemap.tutors", error)
    tutorPages = locales.flatMap((locale) =>
      (data ?? []).map((tutor) => ({
        url: `${SITE_URL}/${locale}/tutors/${tutor.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            ko: `${SITE_URL}/ko/tutors/${tutor.id}`,
            en: `${SITE_URL}/en/tutors/${tutor.id}`,
          },
        },
      }))
    )
  } catch (error) {
    const dynamic = (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE"
    if (dynamic) throw error
    logQueryFailure("sitemap.tutors", error)
    tutorPages = []
  }

  return [
    ...pages,
    ...tutorPages,
    {
      url: `${SITE_URL}/llms.txt`,
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ]
}
