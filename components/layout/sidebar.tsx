"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  user: any
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/feed", label: "Feed", icon: "🏠" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/notifications", label: "Notifikasi", icon: "🔔" },
    ...(user?.role === "officer" ? [{ href: "/officer", label: "Officer Panel", icon: "👮" }] : []),
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* Logo */}
      <Link href="/feed" className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-gray-900">
          UI
        </div>
        <span className="font-bold text-gray-900">LostnFound</span>
      </Link>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === item.href ? "bg-yellow-100 text-yellow-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <div className="text-sm">
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-gray-600">{user?.role === "officer" ? "Officer" : "Mahasiswa"}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
