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

  const linkClass = "nav-link"
  const mobileLinkClass = "nav-link"

  function navClass(href: string) {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`)
    return active ? "nav-link is-active" : linkClass
  }

  return (
    <header className="site-header sticky top-0 z-50 px-3 pt-3 md:px-6">
      <div className="nav-shell mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 md:px-4">
        <Link href="/" className="brand-mark">
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

          <div className="seg" role="group" aria-label={t("language")}>
            <button
              type="button"
              onClick={() => switchLocale("en")}
              aria-pressed={locale === "en"}
              className={locale === "en" ? "is-on" : undefined}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLocale("ko")}
              aria-pressed={locale === "ko"}
              className={locale === "ko" ? "is-on" : undefined}
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
          className="icon-btn inline-flex items-center justify-center md:hidden"
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
          className="nav-menu mx-auto mt-2 max-w-6xl space-y-1 px-4 py-4 md:hidden"
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
            <div className="seg" role="group" aria-label={t("language")}>
              <button
                type="button"
                onClick={() => switchLocale("en")}
                aria-pressed={locale === "en"}
                className={locale === "en" ? "is-on" : undefined}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => switchLocale("ko")}
                aria-pressed={locale === "ko"}
                className={locale === "ko" ? "is-on" : undefined}
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