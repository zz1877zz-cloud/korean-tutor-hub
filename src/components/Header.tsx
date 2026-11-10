"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ensureProfile } from "@/lib/supabase/ensure-profile"
import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import NextLink from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

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

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(() => {
      if (!cancelled) void loadUser()
    })
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
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

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

  const linkClass = "text-zinc-200 hover:text-white transition text-sm min-h-11 inline-flex items-center"
  const mobileLinkClass = "flex items-center min-h-11 text-zinc-100"

  function navClass(href: string) {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`)
    return active
      ? "text-white font-semibold transition text-sm min-h-11 inline-flex items-center"
      : linkClass
  }

  return (
    <header className="site-header border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="brand-mark text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent"
        >
          {t("appName")}
        </Link>

        <nav className="hidden md:flex items-center gap-4" aria-label={t("primaryNav")}>
          <Link href="/tutors" className={navClass("/tutors")}>
            {t("findTutors")}
          </Link>
          <Link href="/#path" className={`${linkClass} hidden lg:inline-flex`}>
            {t("howItWorks")}
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
            <NextLink
              href="/admin/applications"
              className="text-sm text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              {t("admin")}
            </NextLink>
          )}

          <ThemeToggle />

          <div
            className="flex items-center gap-1 text-xs border border-white/10 rounded-full p-0.5"
            role="group"
            aria-label={t("language")}
          >
            <button
              type="button"
              onClick={() => switchLocale("en")}
              aria-pressed={locale === "en"}
              className={`min-h-9 px-2.5 py-1 rounded-full transition ${
                locale === "en"
                  ? "bg-white/15 text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLocale("ko")}
              aria-pressed={locale === "ko"}
              className={`min-h-9 px-2.5 py-1 rounded-full transition ${
                locale === "ko"
                  ? "bg-white/15 text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              KR
            </button>
          </div>

          {email ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-300 max-w-[100px] truncate">
                {email}
              </span>
              <button type="button" onClick={handleLogout} className={linkClass}>
                {t("logout")}
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-secondary">
              {t("login")}
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center text-zinc-100"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            {menuOpen ? "×" : "☰"}
          </span>
          <span className="sr-only">{menuOpen ? t("closeMenu") : t("openMenu")}</span>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="site-header md:hidden border-t border-white/10 bg-[#0a0a0f] px-4 py-4 space-y-1"
        >
          <Link
            href="/tutors"
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary btn-block"
          >
            {t("findTutors")}
          </Link>
          <Link
            href="/#path"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            {t("howItWorks")}
          </Link>

          {email && (
            <>
              <p className="text-[11px] uppercase tracking-wide text-zinc-600 pt-3 pb-1">
                {t("menuStudent")}
              </p>
              <Link
                href="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass}
              >
                {t("myBookings")}
              </Link>
              <Link
                href="/my-consultations"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass}
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
                    className={mobileLinkClass}
                  >
                    {t("tutorProfile")}
                  </Link>
                  <Link
                    href="/tutor/posts"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    {t("tutorPosts")}
                  </Link>
                  <Link
                    href="/tutor/consultations"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    {t("tutorConsultations")}
                  </Link>
                  <Link
                    href="/tutor/bookings"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    {t("tutorBookings")}
                  </Link>
                </>
              ) : (
                <Link
                  href="/apply-tutor"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  {t("applyTutor")}
                </Link>
              )}
            </>
          )}

          {role === "admin" && (
            <NextLink
              href="/admin/applications"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center text-fuchsia-300"
            >
              {t("admin")}
            </NextLink>
          )}

          <div className="flex gap-2 pt-3">
            <ThemeToggle />
            <div className="flex gap-2" role="group" aria-label={t("language")}>
              <button
                type="button"
                onClick={() => switchLocale("en")}
                aria-pressed={locale === "en"}
                className="min-h-11 text-sm px-3 rounded-full border border-white/15 text-zinc-100"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => switchLocale("ko")}
                aria-pressed={locale === "ko"}
                className="min-h-11 text-sm px-3 rounded-full border border-white/15 text-zinc-100"
              >
                KR
              </button>
            </div>
          </div>

          {email ? (
            <button
              type="button"
              onClick={handleLogout}
              className={mobileLinkClass}
            >
              {t("logout")}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn btn-secondary btn-block mt-2"
            >
              {t("login")}
            </Link>
          )}
        </div>
      )}
    </header>
  )
}