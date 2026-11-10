import type { Metadata } from "next"

export const SITE_URL = "https://korean-tutor-hub.vercel.app"

export function languageAlternates(
  locale: string,
  path = ""
): Metadata["alternates"] {
  const suffix = path === "/" ? "" : path
  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      en: `/en${suffix}`,
      ko: `/ko${suffix}`,
      "x-default": `/en${suffix}`,
    },
  }
}

export function pageMeta({
  locale,
  path,
  title,
  description,
}: {
  locale: string
  path: string
  title: string
  description: string
}): Metadata {
  const ko = locale === "ko"
  const suffix = path === "/" ? "" : path
  return {
    title,
    description,
    alternates: languageAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${suffix}`,
      locale: ko ? "ko_KR" : "en_US",
      alternateLocale: ko ? ["en_US"] : ["ko_KR"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
