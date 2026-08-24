"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ensureProfile } from "@/lib/supabase/ensure-profile"
import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/navigation"

export default function Header() {
  const t = useTranslations("common")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isTutor, setIsTutor] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadUser()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session?.user &&
        (event === "SIGNED_IN" || event === "INITIAL_SESSION")
      ) {
        void ensureProfile(supabase, session.user).finally(() => loadUser())
        return
      }
      loadUser()
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setEmail(null)
      setRole(null)
      setIsTutor(false)
      return
    }

    setEmail(user.email ?? null)

    const [{ data: profile }, { data: tutor }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase.from("tutors").select("id").eq("user_id", user.id).maybeSingle(),
    ])

    setRole(profile?.role ?? null)
    setIsTutor(!!tutor)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setEmail(null)
    setRole(null)
    setIsTutor(false)
    setMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  function switchLocale(next: "en" | "ko") {
    router.replace(pathname, { locale: next })
    setMenuOpen(false)
  }

  const linkClass = "text-zinc-400 hover:text-white transition text-sm"
  const mobileLinkClass = "block text-zinc-300"

  return (
    <header className="border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent"
        >
          {t("appName")}
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/tutors" className={linkClass}>
            {t("findTutors")}
          </Link>

          {email && (
            <>
              <Link href="/my-bookings" className={linkClass}>
                {t("myBookings")}
              </Link>
              <Link href="/my-consultations" className={linkClass}>
                {t("myConsultations")}
              </Link>

              {isTutor && (
                <>
                  <span className="text-zinc-700">|</span>
                  <Link href="/tutor/profile" className={linkClass}>
                    {t("tutorProfile")}
                  </Link>
                  <Link href="/tutor/posts" className={linkClass}>
                    {t("tutorPosts")}
                  </Link>
                  <Link href="/tutor/consultations" className={linkClass}>
                    {t("tutorConsultations")}
                  </Link>
                  <Link href="/tutor/bookings" className={linkClass}>
                    {t("tutorBookings")}
                  </Link>
                </>
              )}

              {!isTutor && (
                <Link href="/apply-tutor" className={linkClass}>
                  {t("applyTutor")}
                </Link>
              )}
            </>
          )}

          {role === "admin" && (
            <a
              href="/admin/applications"
              className="text-fuchsia-400 hover:text-fuchsia-300 transition text-sm"
            >
              {t("admin")}
            </a>
          )}

          <div className="flex items-center gap-1 text-xs border border-white/10 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => switchLocale("en")}
              className={`px-2.5 py-1 rounded-full transition ${
                locale === "en"
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLocale("ko")}
              className={`px-2.5 py-1 rounded-full transition ${
                locale === "ko"
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              KR
            </button>
          </div>

          {email ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 max-w-[100px] truncate">
                {email}
              </span>
              <button type="button" onClick={handleLogout} className={linkClass}>
                {t("logout")}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              {t("login")}
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-zinc-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <span className="text-2xl">×</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0f] px-4 py-4 space-y-1">
          <Link
            href="/tutors"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass + " py-2"}
          >
            {t("findTutors")}
          </Link>

          {email && (
            <>
              <p className="text-[11px] uppercase tracking-wide text-zinc-600 pt-3 pb-1">
                {t("menuStudent")}
              </p>
              <Link
                href="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass + " py-2"}
              >
                {t("myBookings")}
              </Link>
              <Link
                href="/my-consultations"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass + " py-2"}
              >
                {t("myConsultations")}
              </Link>

              {isTutor ? (
                <>
                  <p className="text-[11px] uppercase tracking-wide text-zinc-600 pt-3 pb-1">
                    {t("menuTutor")}
                  </p>
                  <Link
                    href="/tutor/profile"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass + " py-2"}
                  >
                    {t("tutorProfile")}
                  </Link>
                  <Link
                    href="/tutor/posts"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass + " py-2"}
                  >
                    {t("tutorPosts")}
                  </Link>
                  <Link
                    href="/tutor/consultations"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass + " py-2"}
                  >
                    {t("tutorConsultations")}
                  </Link>
                  <Link
                    href="/tutor/bookings"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass + " py-2"}
                  >
                    {t("tutorBookings")}
                  </Link>
                </>
              ) : (
                <Link
                  href="/apply-tutor"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass + " py-2"}
                >
                  {t("applyTutor")}
                </Link>
              )}
            </>
          )}

          {role === "admin" && (
            <a
              href="/admin/applications"
              onClick={() => setMenuOpen(false)}
              className="block text-fuchsia-400 py-2"
            >
              {t("admin")}
            </a>
          )}

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => switchLocale("en")}
              className="text-sm px-3 py-1 rounded-full border border-white/15 text-zinc-300"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLocale("ko")}
              className="text-sm px-3 py-1 rounded-full border border-white/15 text-zinc-300"
            >
              KR
            </button>
          </div>

          {email ? (
            <button
              type="button"
              onClick={handleLogout}
              className={mobileLinkClass + " py-2"}
            >
              {t("logout")}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-4 py-2 rounded-full mt-2"
            >
              {t("login")}
            </Link>
          )}
        </div>
      )}
    </header>
  )
}