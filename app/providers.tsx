"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  )
}
