import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Invisible Shield - Trust-Driven Transaction Security",
  description: "AI-powered fraud detection and blockchain trust system for retail security",
  keywords: ["fraud detection", "blockchain", "AI", "cybersecurity", "retail", "trust score"],
  authors: [{ name: "Invisible Shield Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
