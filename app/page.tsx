import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "LostnFound - Campus Lost & Found Platform",
  description: "Manage lost and found items on your campus with verification",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-yellow-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-gray-900">
              UI
            </div>
            <span className="font-bold text-lg text-gray-900">LostnFound</span>
            <span className="text-xs text-gray-600 ml-2">Universitas Indonesia</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Temukan Barang yang Hilang dengan Mudah</h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Platform terpercaya untuk melaporkan dan menemukan barang hilang di lingkungan Universitas Indonesia.
              Sistem verifikasi profesional memastikan keaslian setiap klaim.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">500+</p>
                <p className="text-sm text-gray-600 mt-2">Barang Ditemukan</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">95%</p>
                <p className="text-sm text-gray-600 mt-2">Tingkat Keberhasilan</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">1000+</p>
                <p className="text-sm text-gray-600 mt-2">Pengguna Aktif</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/register">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-6 text-lg">
                  Mulai Sekarang
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-6 text-lg border-gray-300 bg-transparent">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl border border-yellow-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-700 font-semibold">Platform Lost & Found Terpadu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Lapor Barang</h3>
            <p className="text-gray-600">Laporkan barang hilang atau ditemukan dengan foto dan detail lengkap</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Verifikasi Profesional</h3>
            <p className="text-gray-600">Tim officer kampus memverifikasi keaslian klaim dengan foto NPM</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Kolaborasi</h3>
            <p className="text-gray-600">Berikan tips dan tanya jawab langsung dengan pengguna lain</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-200 bg-gray-50 mt-24 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>
            &copy; 2025 LostnFound. Platform resmi Universitas Indonesia untuk melaporkan barang hilang dan ditemukan.
          </p>
        </div>
      </footer>
    </div>
  )
}
