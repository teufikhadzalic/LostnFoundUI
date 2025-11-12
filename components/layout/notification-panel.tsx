"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  postId?: string
  claimId?: string
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setNotifications((prev) => prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)))
    } catch (err) {
      console.error("Failed to mark as read", err)
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "claim_approved":
        return "border-l-4 border-l-green-500 bg-green-50"
      case "claim_rejected":
        return "border-l-4 border-l-red-500 bg-red-50"
      case "post_claimed":
        return "border-l-4 border-l-blue-500 bg-blue-50"
      case "new_comment":
        return "border-l-4 border-l-yellow-500 bg-yellow-50"
      default:
        return "border-l-4 border-l-gray-500 bg-gray-50"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "claim_approved":
        return "✓"
      case "claim_rejected":
        return "✕"
      case "post_claimed":
        return "🎯"
      case "new_comment":
        return "💬"
      default:
        return "ℹ"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifikasi</h2>
          {unreadCount > 0 && <p className="text-sm text-gray-600 mt-1">{unreadCount} belum dibaca</p>}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Tidak ada notifikasi</div>
        ) : (
          <div className="space-y-0">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 transition ${getNotificationColor(
                  notification.type,
                )}`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="flex gap-3">
                  <div className="text-lg flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-semibold" : ""} text-gray-900`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(notification.createdAt).toLocaleString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                  {!notification.read && <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-2"></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 text-center">
        <button onClick={fetchNotifications} className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold">
          Refresh
        </button>
      </div>
    </div>
  )
}
