import type { MetadataRoute } from "next"

const base = "https://korean-tutor-hub.vercel.app"
const locales = ["ko", "en"] as const
const paths = [
  "",
  "/tutors",
  "/login",
  "/apply-tutor",
  "/terms",
  "/privacy",
  "/fees",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/tutors" ? "daily" : "weekly",
      priority: path === "" ? 1 : path === "/tutors" ? 0.9 : 0.6,
      alternates: {
        languages: {
          ko: `${base}/ko${path}`,
          en: `${base}/en${path}`,
        },
      },
    }))
  )
}