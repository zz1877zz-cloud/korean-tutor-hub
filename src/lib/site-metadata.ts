import type { Metadata, Viewport } from "next"

const siteUrl = "https://korean-tutor-hub.vercel.app"

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f4f6",
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Korean Tutor Hub",
    template: "%s · Korean Tutor Hub",
  },
  description:
    "Learn Korean from a song you love. Talk free on Ojakgyo, then ask for a lesson only if it feels right. This site doesn’t charge yet.",
  openGraph: {
    type: "website",
    siteName: "Korean Tutor Hub",
    title: "Korean Tutor Hub",
    description:
      "Learn Korean from a song you love. Talk free on Ojakgyo, then ask for a lesson only if it feels right. This site doesn’t charge yet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Korean Tutor Hub",
    description:
      "Learn Korean from a song you love. Talk free on Ojakgyo, then ask for a lesson only if it feels right. This site doesn’t charge yet.",
  },
}

export const supabaseOrigin = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  try {
    return new URL(url).origin
  } catch {
    return null
  }
})()
