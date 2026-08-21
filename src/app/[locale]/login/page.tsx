"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ensureProfile } from "@/lib/supabase/ensure-profile"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"

export default function LoginPage() {
  const t = useTranslations("auth")
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    await ensureProfile(supabase, data.user)

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
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-300">
            {t("password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50"
            required
            minLength={6}
          />
        </div>

        {message && (
          <p className="text-sm text-center text-fuchsia-300">{message}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-3 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? t("processing") : t("loginTitle")}
        </button>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full border border-white/15 text-zinc-300 py-3 rounded-full font-medium hover:bg-white/5 disabled:opacity-50 transition"
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