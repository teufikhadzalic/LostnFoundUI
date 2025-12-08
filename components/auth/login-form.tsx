"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Login failed")
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Berhasil",
        description: `Selamat datang kembali, ${data.user.name}!`,
      })

      router.push("/feed")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: err instanceof Error ? err.message : "Periksa email dan password Anda.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email UI</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              placeholder="nama@ui.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-medium text-gray-900 bg-gray-50/50 hover:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-medium text-gray-900 bg-gray-50/50 hover:bg-white"
            />
          </div>
          <div className="flex justify-end mt-1">
            <Link href="#" className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 hover:underline">Lupa Password?</Link>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-6 rounded-xl shadow-lg shadow-yellow-400/20 transition-all active:scale-[0.98] text-base group"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            Masuk Sekarang <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-yellow-600 hover:text-yellow-700 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
          <span className="px-4 bg-white text-gray-400">Atau lanjut dengan</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 text-sm"
          onClick={() => window.location.href = `${API_URL}/auth/sso`}
        >
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white">UI</div>
          SSO UI
        </button>
        <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 text-sm">
          <span className="text-lg">G</span> Google
        </button>
      </div>
    </form>
  )
}
