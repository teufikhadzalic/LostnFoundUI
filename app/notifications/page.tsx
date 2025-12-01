"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import NotificationPanel from "@/components/layout/notification-panel"

export default function NotificationsPage() {
  const router = useRouter()

  const handleBack = () => {
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back()
      } else {
        router.push("/feed")
      }
    } catch (err) {
      router.push("/feed")
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b bg-gray-50/50">
          <Button variant="outline" onClick={handleBack} className="p-2 w-10 h-10 flex items-center justify-center" aria-label="Kembali">
            <span className="text-lg">←</span>
          </Button>
          <h1 className="text-lg font-semibold">Notifikasi</h1>
        </div>

        <NotificationPanel />
      </div>
    </div>
  )
}
