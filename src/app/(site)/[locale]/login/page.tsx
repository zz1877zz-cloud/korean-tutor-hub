"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ensureProfile } from "@/lib/supabase/ensure-profile"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"

export default function LoginPage() {
  const t = useTranslations("auth")
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const status = searchParams.get("status")
  const err = searchParams.get("error")
  const notice = err
    ? t("callbackError")
    : status === "already"
      ? t("alreadyMember")
      : status === "confirmed"
        ? t("emailConfirmed")
        : ""
  const shownMessage = message || notice

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    await ensureProfile(supabase, data.user)
    router.push(`/${locale}/tutors`)
    router.refresh()
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const origin = window.location.origin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/${locale}/tutors`,
      },
    })

    if (error) {
      const text = error.message.toLowerCase()
      if (text.includes("already") || text.includes("registered")) {
        setMessage(t("alreadyMember"))
      } else {
        setMessage(error.message)
      }
      setLoading(false)
      return
    }

    if (data.user && (data.user.identities?.length ?? 1) === 0) {
      setMessage(t("alreadyMember"))
      setLoading(false)
      return
    }

    setMessage(t("signUpDone"))
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8 text-center text-white">
        {t("loginTitle")}
      </h1>

      <form className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("email")}
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-fuchsia-500/50"
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("password")}
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-fuchsia-500/50"
            required
            minLength={6}
          />
        </div>

        {shownMessage && (
          <p className="text-sm text-center text-fuchsia-300">{shownMessage}</p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="btn btn-primary btn-block"
        >
          {loading ? t("processing") : t("loginTitle")}
        </button>

        <button
          type="button"
          onClick={handleSignup}
          disabled={loading}
          className="btn btn-secondary btn-block"
        >
          {t("signUp")}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-zinc-500">
        <Link
          href={`/${locale}/tutors`}
          className="text-violet-400 hover:text-violet-300 transition"
        >
          {t("toTutors")}
        </Link>
      </p>
    </div>
  )
}