"use client"

import { createContext, useContext, useSyncExternalStore } from "react"

type Theme = "dark" | "light"

function subscribe(onStoreChange: () => void) {
  window.addEventListener("kth-theme", onStoreChange)
  return () => window.removeEventListener("kth-theme", onStoreChange)
}

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light"
}

function getServerSnapshot(): Theme {
  return "light"
}

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({
  theme: "light",
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useSyncExternalStore(subscribe, currentTheme, getServerSnapshot)

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    window.localStorage.setItem("kth-theme", next)
    window.dispatchEvent(new Event("kth-theme"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
