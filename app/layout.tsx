import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/layout/sidebar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LostnFound - Universitas Indonesia",
  description: "Platform Lost & Found terpadu untuk kampus Universitas Indonesia",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar fixed on the left for md+ screens so it's independent of main content and overlays */}
          <div className="hidden md:block">
            <aside className="fixed left-0 top-0 h-full w-64 lg:w-72 z-20">
              <div className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Sidebar />
              </div>
            </aside>
          </div>

          {/* Main area — add left padding on md+ to make room for fixed sidebar */}
          <main className="md:pl-64 lg:pl-72">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-8">{children}</div>
            </div>
          </main>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
