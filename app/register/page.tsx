import Link from "next/link"
import RegisterForm from "@/components/auth/register-form"
import { Search, ShieldCheck, UserPlus } from "lucide-react"

export const metadata = {
  title: "Daftar - LostnFound",
  
}

export default function RegisterPage() {
  
  return (
    <div className="min-h-screen flex bg-white ">
      {/* Left Side: Hero Branding (Inverted Color Scheme for variety or consistent?) -> Consistent is better */}
      <div className="hidden lg:flex w-1/2 bg-yellow-400 relative overflow-hidden flex-col justify-between p-12 text-gray-900 ">
        {/* Decorative Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 "></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <span className="font-bold text-yellow-500">UI</span>
            </div>
            <span className="text-lg font-bold tracking-tight">LostnFound</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Bergabung Komunitas <br /> Lost & Found UI.
          </h1>
          <p className="text-xl font-medium opacity-80 max-w-md">
            Saling bantu sesama mahasiswa. Laporkan kehilangan atau temuan barang dengan mudah.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6">
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border border-white/30 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <UserPlus className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Daftar Mudah</h3>
              <p className="text-sm opacity-80">Gunakan email UI Anda untuk verifikasi otomatis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50/50 ">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
            <p className="text-gray-500 mt-2">Isi data diri Anda untuk mulai menggunakan aplikasi.</p>
          </div>

          <RegisterForm />

        </div>
      </div>
    </div>
  )
}
