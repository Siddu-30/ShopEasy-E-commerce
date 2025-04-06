import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ComparisonProvider } from "./context/comparison-context"
import { ShoppingProvider } from "./context/shopping-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopEasy - Your One-Stop Shop",
  description: "Discover amazing products at unbeatable prices",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ComparisonProvider>
            <ShoppingProvider>
              {children}
              <Toaster />
            </ShoppingProvider>
          </ComparisonProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'