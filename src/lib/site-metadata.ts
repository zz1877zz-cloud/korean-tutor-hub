import type { Metadata, Viewport } from "next"

const siteUrl = "https://korean-tutor-hub.vercel.app"

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Korean Tutor Hub",
    template: "%s · Korean Tutor Hub",
  },
  description:
    "Find a Korean tutor and start with K-pop lyrics. Ojakgyo is a free consult, always open and not part of any paid package.",
  openGraph: {
    type: "website",
    siteName: "Korean Tutor Hub",
    title: "Korean Tutor Hub",
    description:
      "Find a Korean tutor and start with K-pop lyrics. Ojakgyo is a free consult, always open and not part of any paid package.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Korean Tutor Hub",
    description:
      "Find a Korean tutor and start with K-pop lyrics. Ojakgyo is a free consult, always open and not part of any paid package.",
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
