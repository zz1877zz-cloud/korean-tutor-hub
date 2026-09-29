"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const saved = window.localStorage.getItem("kth-theme")
    const next = saved === "light" ? "light" : "dark"
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
  }, [])

  function toggle() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
    window.localStorage.setItem("kth-theme", next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "라이트 모드" : "다크 모드"}
      title={theme === "dark" ? "라이트 모드" : "다크 모드"}
      className="h-8 w-8 rounded-full border border-white/15 text-zinc-300 hover:text-white text-sm"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  )
}