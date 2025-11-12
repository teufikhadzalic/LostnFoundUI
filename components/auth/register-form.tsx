"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const FACULTIES = [
  "Ilmu Komputer",
  "Kedokteran Gigi",
  "Ilmu Administrasi",
  "Kesehatan Masyarakat",
  "Psikologi",
  "Ilmu Keperawatan",
  "Kedokteran",
  "Ekonomi dan Bisnis",
  "Hukum",
  "Ilmu Sosial dan Ilmu Politik",
  "Ilmu Pengetahuan Budaya",
  "Matematika dan Ilmu Pengetahuan Alam",
  "Teknik",
  "Farmasi",
]

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    npm: "",
    faculty: "",
    role: "student",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.npm && formData.role === "student") {
        throw new Error("NPM/Student ID required untuk mahasiswa")
      }

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Registration failed")
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Berhasil",
        description: "Akun berhasil dibuat! Selamat datang di LostnFound",
      })

      router.push("/feed")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Registration failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-900">Nama Lengkap</label>
        <Input
          type="text"
          name="name"
          placeholder="Ahmad Rizki"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-900">Email UI</label>
        <Input
          type="email"
          name="email"
          placeholder="nama@ui.ac.id"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-900">Password</label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-900">Pilih Role</label>
        <Select value={formData.role} onValueChange={(val) => handleSelectChange("role", val)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Mahasiswa</SelectItem>
            <SelectItem value="officer">Petugas/Officer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.role === "student" && (
        <div>
          <label className="text-sm font-semibold text-gray-900">NPM (Student ID)</label>
          <Input
            type="text"
            name="npm"
            placeholder="2106123456"
            value={formData.npm}
            onChange={handleChange}
            required
            className="mt-2"
          />
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-gray-900">Fakultas</label>
        <Select value={formData.faculty} onValueChange={(val) => handleSelectChange("faculty", val)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Pilih fakultas..." />
          </SelectTrigger>
          <SelectContent>
            {FACULTIES.map((faculty) => (
              <SelectItem key={faculty} value={faculty}>
                {faculty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-6 mt-6"
      >
        {loading ? "Memproses..." : "Buat Akun"}
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
          Masuk di sini
        </Link>
      </p>
    </form>
  )
}
