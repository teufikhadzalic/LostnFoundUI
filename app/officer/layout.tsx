"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// Sidebar is mounted centrally in the root layout; do not render it here to avoid duplication

export default function OfficerLayout({
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

    const parseJwt = (tkn: string | null) => {
      if (!tkn) return null
      try {
        const parts = tkn.split('.')
        if (parts.length < 2) return null
        const payload = parts[1]
        // base64url -> base64
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
          atob(b64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join(''),
        )
        return JSON.parse(json)
      } catch (e) {
        return null
      }
    }

    if (!token) {
      router.push("/login")
      return
    }

    if (userData) {
      const parsedUser = JSON.parse(userData)
      // If role is missing in stored user, try to recover it from the token payload
      if (!parsedUser.role) {
        const decoded = parseJwt(token)
        if (decoded?.role) {
          parsedUser.role = decoded.role
          // update localStorage to keep things in sync
          localStorage.setItem('user', JSON.stringify(parsedUser))
        }
      }

      if (parsedUser.role !== "officer") {
        router.push("/feed")
        return
      }

      setUser(parsedUser)
      setLoading(false)
      return
    }

    // If there's no user in localStorage, try to derive minimal user info from token
    const decoded = parseJwt(token)
    if (decoded && decoded.role === 'officer') {
      setUser({ userId: decoded.userId, role: decoded.role })
      setLoading(false)
      return
    }

    // fallback: not authorized
    router.push('/login')
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar is provided by RootLayout (fixed). */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
