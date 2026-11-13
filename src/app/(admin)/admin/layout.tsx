import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Providers from "@/components/Providers"
import { bodyClassName, themeBootScript } from "@/lib/fonts"
import { siteMetadata, siteViewport } from "@/lib/site-metadata"
import "../../globals.css"

export const metadata = siteMetadata
export const viewport = siteViewport

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/ko/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/ko")
  }

  return (
    <html lang="ko" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={bodyClassName}>
        <Providers>
          <div className="min-h-screen bg-[#0a0a0f] text-white">
            <header className="border-b border-white/10 px-4 h-14 flex items-center justify-between">
              <Link href="/admin/tutors" className="font-semibold text-fuchsia-300">
                관리자
              </Link>
              <nav className="flex gap-4 text-sm text-zinc-300">
                <Link href="/admin/applications" className="hover:text-white">
                  신청 관리
                </Link>
                <Link href="/admin/tutors" className="hover:text-white">
                  튜터 관리
                </Link>
                <Link href="/ko" className="hover:text-white">
                  사이트로
                </Link>
              </nav>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
