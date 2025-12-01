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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0 rounded-xl border border-gray-200 ">
          <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>
        </main>
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
