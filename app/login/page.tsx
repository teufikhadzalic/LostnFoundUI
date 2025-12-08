import Link from "next/link"
import LoginForm from "@/components/auth/login-form"
import { Search, ShieldCheck, MessageSquare } from "lucide-react"

export const metadata = {
  title: "Login - LostnFound",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Hero Branding */}
      <div className="hidden lg:flex w-1/2 bg-yellow-400 relative flex-col justify-between p-12 text-gray-900 ">
        {/* Decorative Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <span className="font-bold text-yellow-500">UI</span>
            </div>
            <span className="text-lg font-bold tracking-tight">LostnFound</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Temukan Barangmu <br /> yang Hilang di UI.
          </h1>
          <p className="text-xl font-medium opacity-80 max-w-md">
            Platform resmi Universitas Indonesia untuk melaporkan dan mencari barang hilang dengan aman dan terverifikasi.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl border border-white/30">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-bold text-sm mb-1">Terverifikasi</h3>
            <p className="text-xs opacity-70">Semua klaim diperiksa oleh petugas resmi.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl border border-white/30">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
              <Search className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-bold text-sm mb-1">Pencarian Pintar</h3>
            <p className="text-xs opacity-70">Filter berdasarkan fakultas & lokasi.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl border border-white/30">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
              <MessageSquare className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-bold text-sm mb-1">Diskusi</h3>
            <p className="text-xs opacity-70">Tanya jawab langsung di kolom komentar.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali!</h2>
            <p className="text-gray-500 mt-2">Masuk untuk mengelola laporan dan klaim Anda.</p>
          </div>

          <LoginForm />

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100/50">
            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-2">Demo Access</p>
            <div className="space-y-1 text-xs text-yellow-700 font-mono">
              <p>Officer: officer@ui.ac.id / password123</p>
              <p>Mhs: mahasiswa@ui.ac.id / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
