import Link from "next/link"
import LoginForm from "@/components/auth/login-form"

export const metadata = {
  title: "Login - LostnFound",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="grid md:grid-cols-2 min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center px-8 bg-gradient-to-br from-yellow-400 to-yellow-300">
          <Link href="/" className="mb-12">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center font-bold text-2xl text-yellow-500">
                UI
              </div>
              <div>
                <p className="font-bold text-xl text-white">LostnFound</p>
                <p className="text-sm text-yellow-100">Universitas Indonesia</p>
              </div>
            </div>
          </Link>

          <div className="text-white space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Platform Lost & Found Terpadu Kampus UI</h2>
              <p className="text-lg text-yellow-50 leading-relaxed">
                Laporkan dan temukan barang hilang dengan sistem verifikasi profesional. Aman, terpercaya, dan terbukti
                efektif.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl">✓</span>
                <p>Verifikasi resmi oleh officer kampus</p>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">✓</span>
                <p>Filter berdasarkan fakultas dan lokasi</p>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">✓</span>
                <p>Komunikasi langsung dengan pengguna</p>
              </div>
            </div>

            <div className="pt-8 border-t border-yellow-200">
              <p className="text-sm text-yellow-100">
                Sudah terdaftar?{" "}
                <Link href="/login" className="font-semibold hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center px-8 md:px-12">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun Anda</h1>
            <p className="text-gray-600 mb-8">Gunakan email UI atau SSO untuk mengakses platform</p>

            <LoginForm />

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Demo Akun:</p>
              <p className="text-xs text-gray-700">• Petugas: officer@ui.ac.id / password123</p>
              <p className="text-xs text-gray-700">• Mahasiswa: mahasiswa@ui.ac.id / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
