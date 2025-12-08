"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface Claim {
  _id: string
  postId: {
    _id: string
    itemName: string
  }
  userId: {
    name: string
  }
  status: "pending" | "approved" | "rejected"
}

interface VerificationModalProps {
  claim: Claim
  action: "approve" | "reject"
  onClose: () => void
  onVerify: (status: "approved" | "rejected") => void
}

export default function VerificationModal({ claim, action, onClose, onVerify }: VerificationModalProps) {
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    setLoading(true)

    try {
      const status = action === "approve" ? "approved" : "rejected"
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/officer/${claim._id}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status,
            verificationNote: note || `${action === "approve" ? "Disetujui" : "Ditolak"} oleh officer`,
          }),
        },
      )

      if (!res.ok) {
        throw new Error("Gagal memproses verifikasi")
      }

      toast({
        title: "Berhasil",
        description: `Klaim ${status === "approved" ? "disetujui" : "ditolak"}`,
      })

      onVerify(status)
      onClose()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal memproses verifikasi",
      })
    } finally {
      setLoading(false)
    }
  }

  const isApprove = action === "approve"

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden transform scale-100 transition-all">

        {/* Header Graphic */}
        <div className={`h-32 flex flex-col items-center justify-center text-white ${isApprove ? "bg-emerald-500" : "bg-rose-500"}`}>
          {isApprove ? <CheckCircle2 className="w-12 h-12 mb-2" /> : <XCircle className="w-12 h-12 mb-2" />}
          <h2 className="text-2xl font-bold">
            {isApprove ? "Setujui Klaim" : "Tolak Klaim"}
          </h2>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              Anda akan {isApprove ? <span className="text-emerald-600 font-bold">menyetujui</span> : <span className="text-rose-600 font-bold">menolak</span>} klaim barang
              <br /><span className="font-bold text-gray-900">"{claim.postId.itemName}"</span><br />
              yang diajukan oleh <span className="font-bold text-gray-900">{claim.userId.name}</span>.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Catatan Officer
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tambahkan alasan atau catatan..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none resize-none text-sm transition-all"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={onClose}
                variant="ghost"
                className="flex-1 rounded-xl h-11 text-gray-500 hover:text-gray-900"
              >
                Batal
              </Button>
              <Button
                onClick={handleVerify}
                disabled={loading}
                className={`flex-[2] rounded-xl h-11 font-bold shadow-lg text-white border-0 ${isApprove
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                    : "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                  }`}
              >
                {loading ? "Memproses..." : "Konfirmasi"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
