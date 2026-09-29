"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import ThemeProvider from "@/components/ThemeProvider"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())

  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}