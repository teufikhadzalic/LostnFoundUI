"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")

export default function SSOCallbackPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      try {
        // The backend now sets a httpOnly cookie named 'token'.
        // Call /api/auth/me (with credentials) to get the user object.
        const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
        if (!res.ok) {
          toast({ variant: "destructive", title: "SSO gagal", description: "Gagal mendapatkan informasi user" })
          router.replace("/login")
          return
        }

        const user = await res.json()
        localStorage.setItem("user", JSON.stringify(user))

        toast({ title: "SSO berhasil", description: "Anda telah masuk lewat SSO" })
        setTimeout(() => router.replace("/feed"), 600)
      } catch (err) {
        toast({ variant: "destructive", title: "SSO error", description: "Terjadi kesalahan saat memproses SSO" })
        router.replace("/login")
      }
    })()
  }, [router, toast])

  return <div className="p-8 text-center">Memproses login SSO…</div>
}
