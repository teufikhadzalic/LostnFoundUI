"use client"

import { usePathname } from "next/navigation"
import React from "react"
import Navbar from "@/components/layout/navbar"

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname() || "/"

  // hide navbar on login/register pages if desired? 
  // Usually landing page (/) might want a different nav or the same one. 
  // Based on previous code, sidebar was hidden on / and /login.
  // Let's assume user wants Navbar everywhere EXCEPT login/register for simplicity, or maybe same rules.
  // Sidebar was: const hideSidebar = pathname === "/" || pathname === "/login" || pathname === "/register"

  const hideNavbar = pathname === "/login" || pathname === "/register"
  // Note: if pathname === "/" (Landing), we might want to show it or have a special landing nav. 
  // For now let's keep it consistent: if it was hidden before, maybe hide it? 
  // Actually, usually headers are good on landing pages. Let's show it on "/" unless user logged out? 
  // The sidebar logic hid it on "/". Let's use the same logic for now to be safe, but "top header" usually implies standard web nav.
  // Let's stick to the previous hiding rule to avoid breaking landing page design if it has its own hero section.
  const isAuthPage = pathname === "/login" || pathname === "/register"
  const isLanding = pathname === "/"

  const showNavbar = !isAuthPage && !isLanding

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      {showNavbar && <Navbar />}

      {/* Main Content */}
      {/* Add top padding to account for fixed navbar (h-16 = 4rem = pt-16) */}
      <main className={`${showNavbar ? "pt-16" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
