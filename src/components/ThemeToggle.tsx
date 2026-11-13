"use client"

import { useTranslations } from "next-intl"
import { useTheme } from "@/components/ThemeProvider"

export default function ThemeToggle() {
  const t = useTranslations("common")
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t("themeToLight") : t("themeToDark")}
      title={theme === "dark" ? t("themeToLight") : t("themeToDark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm text-zinc-100 hover:text-white"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  )
}
