import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, ShieldCheck, MessageCircle, ArrowRight, Github } from "lucide-react"

export const metadata = {
  title: "LostnFound - Universitas Indonesia",
  description: "Platform kehilangan dan penemuan barang resmi Universitas Indonesia",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-yellow-200 ">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <span className="font-bold text-gray-900">UI</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none">LostnFound</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Universitas Indonesia</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" className="font-medium hover:bg-gray-100 rounded-full px-6">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gray-900 hover:bg-black text-white rounded-full px-6 font-bold shadow-lg shadow-gray-900/20 transition-all hover:scale-105">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-200/30 rounded-full blur-3xl -z-10 animate-pulse delay-1000 duration-5000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Platform Resmi Kampus UI
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
            Kehilangan Barang? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
              Temukan di Sini.
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
            Jangan panik. Laporkan kehilangan atau temuan barang Anda di platform terintegrasi Universitas Indonesia. Aman, Cepat, dan Terverifikasi.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
            <Link href="/feed">
              <Button size="lg" className="h-14 px-8 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg shadow-xl shadow-yellow-400/20 transition-all hover:-translate-y-1">
                Cari Barang
                <Search className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-gray-200 hover:border-gray-900 bg-white text-gray-900 font-bold text-lg transition-all hover:-translate-y-1">
                Buat Laporan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Bento Grid */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verifikasi Valid</h3>
              <p className="text-gray-600 leading-relaxed">
                Setiap laporan diverifikasi manual oleh petugas kemanusiaan kampus (Officer) untuk mencegah penipuan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-gray-900 text-white md:scale-105 shadow-2xl shadow-gray-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gray-700/50 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-700">
                  <Search className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Pencarian Cerdas</h3>
                <p className="text-gray-400 leading-relaxed">
                  Sistem filter canggih berdasarkan kategori, warna, dan lokasi fakultas untuk mempercepat penemuan.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Diskusi Langsung</h3>
              <p className="text-gray-600 leading-relaxed">
                Fitur komentar real-time memungkinkan Anda bertanya detail barang kepada penemu tanpa perantara rumit.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">UI</div>
            <span className="font-bold text-gray-900">LostnFound</span>
          </div>

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Universitas Indonesia. All rights reserved.
          </div>

          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
