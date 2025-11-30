"use client"

import { useState } from "react"
import Link from "next/link"
import type { User } from "@/types"
import { UserAvatar } from "@/components/shared"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Settings, UserIcon, MessageCircle, CheckCircle, XCircle } from "lucide-react"

interface DashboardHeaderProps {
  user: User
  notificationCount?: number
  onLogout?: () => void
  onMenuToggle?: (open: boolean) => void
  notifications?: any[]
}

// Mock notifications for preview
const mockNotifications = [
  {
    id: "notif-1",
    type: "claim_approved",
    title: "Klaim Disetujui",
    message: "iPhone 13 Pro Max Anda telah disetujui",
    time: "2 jam lalu",
    itemId: "item-1",
    icon: CheckCircle,
  },
  {
    id: "notif-2",
    type: "comment_added",
    title: "Komentar Baru",
    message: "Ada komentar pada posting Dompet Kulit Hitam Anda",
    time: "5 jam lalu",
    itemId: "item-2",
    icon: MessageCircle,
  },
  {
    id: "notif-3",
    type: "claim_rejected",
    title: "Klaim Ditolak",
    message: "Klaim Anda untuk item ditolak",
    time: "1 hari lalu",
    itemId: "item-3",
    icon: XCircle,
  },
]

export function DashboardHeader({
  user,
  notificationCount = 0,
  onLogout,
  onMenuToggle,
  notifications,
}: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const handleMenuToggle = (open: boolean) => {
    setMenuOpen(open)
    onMenuToggle?.(open)
  }

  const handleNotificationClick = (itemId?: string) => {
    if (itemId) {
      window.location.href = `/dashboard/items/${itemId}`
    }
  }

  return (
    <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary lg:hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
            LF
          </div>
        </Link>

        {/* Center Spacer */}
        <div className="flex-1 hidden lg:block" />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications with Hover Preview */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-5 w-5 bg-destructive rounded-full text-xs text-white flex items-center justify-center font-semibold">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="px-2 py-1.5 font-semibold text-sm">Notifikasi</div>
              {(notifications || mockNotifications).length > 0 ? (
                (notifications || mockNotifications).map((notif) => {
                  const Icon = notif.icon || MessageCircle
                  return (
                    <DropdownMenuItem
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.itemId)}
                      className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-slate-800/50"
                    >
                      <div className="flex items-start gap-2 w-full">
                        <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )
                })
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">Tidak ada notifikasi</div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifications" className="cursor-pointer justify-center">
                  Lihat Semua
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu open={menuOpen} onOpenChange={handleMenuToggle}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-300 hover:text-white">
                <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
                <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
