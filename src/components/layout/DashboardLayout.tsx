"use client"

import type React from "react"
import { useState } from "react"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardSidebar } from "./DashboardSidebar"
import type { User } from "@/types"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
  notificationCount?: number
  onLogout?: () => void
}

export function DashboardLayout({ children, user, notificationCount = 0, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <DashboardHeader
        user={user}
        notificationCount={notificationCount}
        onLogout={onLogout}
        onMenuToggle={setSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar userRole={user.role} />

        {/* Main Content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
