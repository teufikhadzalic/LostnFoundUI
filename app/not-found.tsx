import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <div className="w-24 h-24 bg-yellow-50 rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-xl shadow-yellow-100">
                <span className="text-4xl font-bold text-yellow-500">404</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h1>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                Maaf, halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia. Coba periksa kembali URL-nya.
            </p>

            <div className="flex gap-4">
                <Link href="/">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full px-6 h-12">
                        <Home className="w-4 h-4 mr-2" />
                        Kembali ke Home
                    </Button>
                </Link>
                <Link href="/feed">
                    <Button variant="outline" className="rounded-full px-6 h-12 font-bold border-gray-200">
                        <Search className="w-4 h-4 mr-2" />
                        Cari Barang
                    </Button>
                </Link>
            </div>
        </div>
    )
}
