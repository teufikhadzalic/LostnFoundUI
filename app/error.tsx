"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 max-w-sm mb-8">
                Jangan khawatir, ini hanya kesalahan sistem sementara. Silakan coba muat ulang halaman.
            </p>

            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-gray-900 hover:bg-black text-white font-bold rounded-xl px-6 h-12"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Coba Lagi
                </Button>
            </div>
        </div>
    )
}
