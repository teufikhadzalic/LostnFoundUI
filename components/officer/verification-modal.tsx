"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className={`border-b ${isApprove ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} p-6`}>
          <h2 className={`text-xl font-bold ${isApprove ? "text-green-900" : "text-red-900"}`}>
            {isApprove ? "Setujui Klaim" : "Tolak Klaim"}
          </h2>
          <p className={`text-sm mt-1 ${isApprove ? "text-green-700" : "text-red-700"}`}>
            {isApprove
              ? `Klaim dari ${claim.userId.name} untuk ${claim.postId.itemName} akan disetujui`
              : `Klaim dari ${claim.userId.name} untuk ${claim.postId.itemName} akan ditolak`}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">
              Catatan {isApprove ? "Persetujuan" : "Penolakan"} (Opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isApprove
                  ? "Misalnya: Verifikasi berhasil, identitas cocok"
                  : "Misalnya: Foto NPM tidak jelas, alasan klaim mencurigakan"
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 border-gray-300 bg-transparent">
              Batal
            </Button>
            <Button
              onClick={handleVerify}
              disabled={loading}
              className={`flex-1 ${
                isApprove ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              } text-white font-semibold`}
            >
              {loading ? "Memproses..." : isApprove ? "Setujui" : "Tolak"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
