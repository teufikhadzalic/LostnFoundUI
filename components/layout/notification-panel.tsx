"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import PostDetailModal from "@/components/feed/post-detail-modal"
import { formatDateTime } from "@/lib/formatDate"
import { Bell, CheckCircle2, XCircle, Info, MessageCircle, AlertCircle } from "lucide-react"

interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  postId?: string
  claimId?: string
  post?: any
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000)
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
    markAsRead(notification._id)

    if (notification.post) {
      setSelectedPost(notification.post)
      return
    }

    if (notification.postId) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${notification.postId}`)
        if (!res.ok) throw new Error("Gagal memuat posting")
        const data = await res.json()
        setSelectedPost(data)
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Gagal memuat detail" })
      }
      return
    }

    // Fallback for simple messages
    toast({ title: "Info", description: notification.message })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "claim_approved": return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "claim_rejected": return <XCircle className="w-5 h-5 text-red-500" />
      case "new_comment": return <MessageCircle className="w-5 h-5 text-yellow-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-[500px]">
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Memuat notifikasi...
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
          <Bell className="w-12 h-12 mb-4 opacity-20" />
          <p>Belum ada notifikasi baru</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => openNotification(n)}
              className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!n.read ? "bg-blue-50/30" : ""}`}
            >
              {/* Unread Indicator */}
              {!n.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />}

              <div className="mt-1 flex-shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm text-gray-900 ${!n.read ? "font-bold" : "font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(n.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && selectedPost.userId && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostUpdated={fetchNotifications}
        />
      )}
    </div>
  )
}
