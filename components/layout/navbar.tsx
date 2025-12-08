"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { LogOut, Menu, User, Bell, Home, Hexagon } from "lucide-react"

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user")
            if (raw) setUser(JSON.parse(raw))
        } catch (e) {
            setUser(null)
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { href: "/feed", label: "Feed", icon: <Home className="w-4 h-4" /> },
        { href: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
        { href: "/notifications", label: "Notifikasi", icon: <Bell className="w-4 h-4" /> },
        ...(user?.role === "officer" ? [{ href: "/officer", label: "Officer Panel", icon: <Hexagon className="w-4 h-4" /> }] : []),
    ]

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                    ? "bg-white/80 backdrop-blur-md border-gray-200/50 shadow-sm"
                    : "bg-white border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/feed" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform duration-300">
                        <span className="font-bold text-white text-sm">UI</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg hidden sm:block tracking-tight">LostnFound</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-1 ml-auto mr-6 bg-gray-100/50 p-1 rounded-xl border border-gray-100">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold ${isActive
                                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Right Side: User & Logout */}
                <div className="hidden md:flex items-center gap-4 pl-4 border-l border-gray-200">
                    {user && (
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{user.role === 'officer' ? 'Officer' : 'Mahasiswa'}</p>
                        </div>
                    )}
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-4 shadow-xl absolute w-full animate-in slide-in-from-top-2">
                    <nav className="flex flex-col space-y-2 pb-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === item.href ? "bg-yellow-50 text-yellow-800 font-bold" : "text-gray-600 font-medium active:bg-gray-50"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 my-2 pt-4 space-y-4">
                            {user && (
                                <div className="px-3 flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-gray-600">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">{user.role}</p>
                                    </div>
                                </div>
                            )}
                            <Button
                                onClick={handleLogout}
                                variant="destructive"
                                className="w-full justify-center rounded-xl font-bold"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
