import Link from "next/link"
import RegisterForm from "@/components/auth/register-form"

export const metadata = {
  title: "Register - LostnFound",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-md mx-auto px-6 py-12">
        <Link href="/" className="mb-8 block">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-gray-900">
              UI
            </div>
            <div>
              <p className="font-bold text-gray-900">LostnFound</p>
              <p className="text-xs text-gray-600">Universitas Indonesia</p>
            </div>
          </div>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h1>
        <p className="text-gray-600 mb-8">Bergabunglah dengan platform Lost & Found terpercaya Universitas Indonesia</p>

        <RegisterForm />

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">Tips Pendaftaran:</p>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Gunakan email UI resmi (@ui.ac.id)</li>
            <li>• Mahasiswa harus menyertakan NPM</li>
            <li>• Officer harus didaftarkan oleh admin</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
