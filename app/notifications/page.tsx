"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import NotificationPanel from "@/components/layout/notification-panel"
import { ArrowLeft, Bell } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-600">Terbaru</span>
        </div>
        <NotificationPanel />
      </div>
    </div>
  )
}
