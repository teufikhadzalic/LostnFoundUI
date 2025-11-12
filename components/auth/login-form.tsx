"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

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
        description: `Selamat datang ${data.user.name}!`,
      })

      router.push("/feed")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Login gagal",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-900">Email UI</label>
        <Input
          type="email"
          placeholder="nama@ui.ac.id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-900">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-2"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-6"
      >
        {loading ? "Memproses..." : "Masuk"}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-600">Atau masuk dengan</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="border-gray-300 bg-transparent">
          SSO UI
        </Button>
        <Button variant="outline" type="button" className="border-gray-300 bg-transparent">
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-4">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-yellow-600 hover:text-yellow-700">
          Daftar di sini
        </Link>
      </p>
    </form>
  )
}
