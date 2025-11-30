import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Shield, Users, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold">
              LF
            </div>
            LostnFound
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90">Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance">
              Platform Lost & Found
              <span className="text-primary block">Universitas Indonesia</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto text-balance">
              Temukan barang hilang Anda dengan mudah. Sistem verifikasi yang aman dan terpercaya memastikan setiap item
              dikembalikan ke pemiliknya.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  Masuk Akun Existing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-800/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: "Barang Ditemukan", value: "0" },
              { label: "Tingkat Keberhasilan", value: "0%" },
              { label: "Pengguna Aktif", value: "0" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h2 className="text-4xl font-bold text-white mb-16 text-center">Fitur Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Search,
              title: "Pencarian Cerdas",
              description: "Filter berdasarkan kategori, lokasi, dan fakultas untuk menemukan barang dengan cepat.",
            },
            {
              icon: Shield,
              title: "Verifikasi Aman",
              description: "Sistem verifikasi berlapis memastikan hanya pemilik asli yang mendapatkan barang.",
            },
            {
              icon: Users,
              title: "Komunitas Terpercaya",
              description: "Bergabung dengan ribuan pengguna kampus yang saling membantu menemukan barang.",
            },
            {
              icon: TrendingUp,
              title: "Statistik Realtime",
              description: "Pantau status klaim Anda dan dapatkan notifikasi untuk setiap update terbaru.",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="p-6 border border-slate-800/50 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-smooth"
              >
                <Icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800/50 bg-gradient-to-r from-primary/10 via-transparent to-primary/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Siap Memulai?</h2>
          <p className="text-slate-400 mb-8">Bergabunglah dengan ribuan pengguna lain dalam menemukan barang hilang.</p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Buat Akun Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>© 2025 LostnFound - Campus Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
