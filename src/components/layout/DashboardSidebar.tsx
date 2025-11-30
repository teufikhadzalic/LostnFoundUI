"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserRole } from "@/types"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Shield, Settings, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  userRole: UserRole
  className?: string
}

const menuItems = [
  {
    label: "Feed",
    href: "/dashboard/feed",
    icon: Home,
    roles: [UserRole.STUDENT, UserRole.OFFICER],
  },
  {
    label: "Item Saya",
    href: "/dashboard/my-items",
    icon: LayoutGrid,
    roles: [UserRole.STUDENT, UserRole.OFFICER],
  },
  {
    label: "Verifikasi",
    href: "/dashboard/verification",
    icon: Shield,
    roles: [UserRole.OFFICER],
  },
  {
    label: "Pesan",
    href: "/dashboard/messages",
    icon: MessageSquare,
    roles: [UserRole.STUDENT, UserRole.OFFICER],
  },
  {
    label: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [UserRole.STUDENT, UserRole.OFFICER],
  },
]

export function DashboardSidebar({ userRole, className }: DashboardSidebarProps) {
  const pathname = usePathname()

  const visibleItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <aside
      className={cn("w-64 border-r border-slate-800/50 bg-slate-900/30 p-6 hidden lg:flex flex-col gap-8", className)}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold">
          LF
        </div>
        <span className="text-white">LostnFound</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive
                    ? "bg-primary text-slate-900 hover:bg-primary/90"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-800/50">
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg">
          <p className="text-xs font-semibold text-primary mb-2">Fitur Baru</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Notifikasi real-time untuk setiap update status klaim Anda.
          </p>
        </div>
      </div>
    </aside>
  )
}
