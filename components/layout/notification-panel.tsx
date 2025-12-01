"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import PostDetailModal from "@/components/feed/post-detail-modal"

interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  postId?: string
  claimId?: string
  // optional embedded post payload — when available the UI will open modal without an extra fetch
  post?: any
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)
  const [postLoading, setPostLoading] = useState(false)
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

  const openNotification = async (notification: Notification) => {
    // mark as read locally & server
  markAsRead(notification._id)

    // If notification already includes post payload, use it (fast path)
    if (notification.post) {
      setSelectedPost(notification.post)
      return
    }

    // if notification references a postId, fetch it and open modal
    if (notification.postId) {
      try {
  setPostLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${notification.postId}`)
        if (!res.ok) throw new Error("Gagal memuat posting")
        const data = await res.json()
        setSelectedPost(data)
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal memuat posting" })
      } finally {
        setPostLoading(false)
      }
      return
    }

    // If notification references a claimId, fetch claim detail and open related post
    if (notification.claimId) {
      try {
        setPostLoading(true)
        const resClaim = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/claims/detail/${notification.claimId}`)
        if (!resClaim.ok) throw new Error("Gagal memuat klaim")
        const claim = await resClaim.json()
        if (claim.postId) {
          // claim.postId is populated by backend
          setSelectedPost(claim.postId)
        } else {
          toast({ title: "Notifikasi", description: notification.message })
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal memuat klaim" })
      } finally {
        setPostLoading(false)
      }
      return
    }

    // fallback: just show message
    toast({ title: "Notifikasi", description: notification.message })
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
      case "match_found":
        return "border-l-4 border-l-indigo-500 bg-indigo-50"
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
                className={`border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-100 active:scale-[0.99] transition-all duration-200 ${getNotificationColor(
                  notification.type,
                )}`}
                onClick={() => openNotification(notification)}
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

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} onPostUpdated={() => { fetchNotifications(); setSelectedPost(null) }} />
      )}
    </div>
  )
}
