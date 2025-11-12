"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import NotificationPanel from "@/components/layout/notification-panel"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 border-r border-gray-200 bg-white overflow-y-auto">
        <Sidebar user={user} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold text-sm text-gray-900">
              UI
            </div>
            <span className="font-bold text-gray-900">LostnFound</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/notifications" className="text-gray-600 hover:text-gray-900 text-lg">
              🔔
            </a>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>

      {/* Notification Panel - Desktop */}
      <div className="hidden lg:flex flex-col w-80 border-l border-gray-200 bg-white overflow-hidden">
        <NotificationPanel />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around px-4 py-3">
          <a href="/feed" className="flex flex-col items-center gap-1 text-yellow-500">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Feed</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-gray-600 hover:text-yellow-500">
            <span className="text-lg">👤</span>
            <span className="text-xs">Profile</span>
          </a>
          <a href="/notifications" className="flex flex-col items-center gap-1 text-gray-600 hover:text-yellow-500">
            <span className="text-lg">🔔</span>
            <span className="text-xs">Notif</span>
          </a>
        </div>
      </div>
    </div>
  )
}
