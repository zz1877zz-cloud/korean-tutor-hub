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
      className="icon-btn inline-flex items-center justify-center"
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3" fill="currentColor" />
          <path
            d="M8 1.2v1.8M8 13v1.8M1.2 8h1.8M13 8h1.8M3.1 3.1l1.3 1.3M11.6 11.6l1.3 1.3M12.9 3.1l-1.3 1.3M4.4 11.6l-1.3 1.3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M10.2 1.6a6.2 6.2 0 1 0 4.2 10.4A5.4 5.4 0 0 1 10.2 1.6z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  )
}
