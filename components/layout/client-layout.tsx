"use client"

import { usePathname } from "next/navigation"
import React from "react"
import Sidebar from "@/components/layout/sidebar"

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname() || "/"

  // hide sidebar on main page (`/`) and login page (`/login`)
  const hideSidebar = pathname === "/" || pathname === "/login" || pathname === "/register"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar fixed on left for md+ when not hidden */}
      {!hideSidebar && (
        <div className="hidden md:block">
          <aside className="fixed left-0 top-0 h-full w-64 lg:w-72 z-20">
            <div className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Sidebar />
            </div>
          </aside>
        </div>
      )}

      {/* Main area — add left padding on md+ only when sidebar is visible */}
      <main className={`${!hideSidebar ? "md:pl-64 lg:pl-72" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">{children}</div>
        </div>
      </main>
  {/* global chat widget removed */}
    </div>
  )
}
