import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold">
                LF
              </div>
              LostnFound
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <LoginForm />

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <p className="text-xs font-semibold text-primary mb-2">Demo Akun:</p>
              <div className="space-y-1 text-xs text-slate-300">
                <p>• Petugas: petugas.officer@ui.ac.id / password123</p>
                <p>• Mahasiswa: mahasiswa@ui.ac.id / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
