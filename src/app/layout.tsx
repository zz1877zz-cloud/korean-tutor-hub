import type { Metadata } from "next"
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Korean Tutor Hub",
    template: "%s · Korean Tutor Hub",
  },
  description:
    "좋아하는 가사를 진심으로 느껴보세요. 오작교로 먼저 대화하고, 맞으면 수업해요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "Korean Tutor Hub",
    title: "Korean Tutor Hub",
    description:
      "좋아하는 가사를 진심으로 느껴보세요. 오작교로 먼저 대화하고, 맞으면 수업해요.",
    images: [
      {
        url: "/hero-lyrics-wide.jpg",
        width: 1200,
        height: 630,
        alt: "Korean Tutor Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Korean Tutor Hub",
    description:
      "좋아하는 가사를 진심으로 느껴보세요. 오작교로 먼저 대화하고, 맞으면 수업해요.",
    images: ["/hero-lyrics-wide.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("kth-theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-zinc-100`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}