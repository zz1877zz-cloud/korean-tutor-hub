import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = "https://korean-tutor-hub.vercel.app"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Korean Tutor Hub",
    template: "%s · Korean Tutor Hub",
  },
  description:
    "Find a Korean tutor and start with K-pop lyrics. Ojakgyo is a free consult, always open and not part of any paid package.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var seg=location.pathname.split("/").filter(Boolean)[0];if(seg==="ko"||seg==="en")document.documentElement.lang=seg;var t=localStorage.getItem("kth-theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#0a0a0f] text-zinc-100`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}