"use client"

import NotificationPanel from "@/components/layout/notification-panel"

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <NotificationPanel />
      </div>
    </div>
  )
}
