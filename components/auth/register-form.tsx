"use client"

import type React from "react"
import Link from "next/link"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User, LucideIdCard, Building2, UserCircle2, ArrowRight, Loader2, Camera, UserCircle } from "lucide-react"

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
    profileImage: "", // Changed from file to base64 string
  })
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.npm && formData.role === "student") {
        throw new Error("NPM wajib diisi untuk mahasiswa")
      }

      // Send as JSON with Base64 image
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Gagal mendaftar")
      }

      const result = await res.json()
      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))

      toast({
        title: "Pendaftaran Berhasil! 🎉",
        description: "Selamat datang di komunitas LostnFound UI.",
      })

      router.push("/feed")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal Mendaftar",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat pendaftaran",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">

      {/* Profile Picture Upload */}
      <div className="flex justify-center mb-6">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center transition-transform hover:scale-105">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-16 h-16 text-gray-300" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <Camera className="w-4 h-4 text-gray-900" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Nama Lengkap</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <User className="h-5 w-5" />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Contoh: Budi Santoso"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-medium text-gray-900 bg-gray-50/50 hover:bg-white"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email UI</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Mail className="h-5 w-5" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="nama@ui.ac.id"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-medium text-gray-900 bg-gray-50/50 hover:bg-white"
          />
        </div>
      </div>

      {/* Role Selector (Custom UI) */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Daftar Sebagai</label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div
            onClick={() => setFormData(p => ({ ...p, role: "student" }))}
            className={`cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.role === 'student' ? 'bg-yellow-50 border-yellow-400 text-yellow-800 ring-1 ring-yellow-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <UserCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Mahasiswa</span>
          </div>
          <div
            onClick={() => setFormData(p => ({ ...p, role: "officer" }))}
            className={`cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.role === 'officer' ? 'bg-yellow-50 border-yellow-400 text-yellow-800 ring-1 ring-yellow-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <LucideIdCard className="w-5 h-5" />
            <span className="font-bold text-sm">Officer</span>
          </div>
        </div>
      </div>

      {/* NPM (Conditional) */}
      {formData.role === "student" && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">NPM (Nomor Pokok Mahasiswa)</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <LucideIdCard className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="npm"
              placeholder="2106xxxxxx"
              value={formData.npm}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-medium text-gray-900 bg-gray-50/50 hover:bg-white"
            />
          </div>
        </div>
      )}

      {/* Faculty */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Fakultas</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Building2 className="h-5 w-5" />
          </div>
          <select
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-medium text-gray-900 bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
          >
            <option value="">Pilih Fakultas...</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Buat Password</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Lock className="h-5 w-5" />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Minimal 8 karakter"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-medium text-gray-900 bg-gray-50/50 hover:bg-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-6 rounded-xl shadow-lg shadow-gray-900/20 transition-all active:scale-[0.98] text-base group mt-4"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            Buat Akun <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-gray-900 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </form>
  )
}
