"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/formatDate"
import { Button } from "@/components/ui/button"
import VerificationModal from "@/components/officer/verification-modal"
import { CheckCircle2, Clock, XCircle, MessageCircle } from "lucide-react"

interface Claim {
  _id: string
  postId: {
    _id: string
    itemName: string
    image: string
  } | null
  userId: {
    _id: string
    name: string
    npm: string
    profileImage?: string
  }
  reason: string
  evidencePhoto: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface ClaimVerificationCardProps {
  claim: Claim
  onVerify: (status: "approved" | "rejected") => void
  onViewPost: (postId: string) => void
}

export default function ClaimVerificationCard({ claim, onVerify, onViewPost }: ClaimVerificationCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleAction = (action: "approve" | "reject") => {
    setSelectedAction(action)
    setShowModal(true)
  }

  // Status Styles
  const statusConfig = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <Clock className="w-4 h-4" />,
      label: "Menunggu"
    },
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Disetujui"
    },
    rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: <XCircle className="w-4 h-4" />,
      label: "Ditolak"
    }
  }

  const currentStatus = statusConfig[claim.status]

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Header Ribbon */}
        <div className={`h-2 w-full ${claim.status === 'approved' ? 'bg-emerald-500' : claim.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-400'}`}></div>

        <div className="p-6">
          {/* Top Row: Item Name & Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  src={(claim.postId && claim.postId.image) || "/placeholder.svg"}
                  alt="Item"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {claim.postId ? claim.postId.itemName : "(Item Deleted)"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Diajukan: {formatDateTime(claim.createdAt)}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
              {currentStatus.icon}
              <span className="text-sm font-bold">{currentStatus.label}</span>
            </div>
          </div>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left: Photos */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Foto Barang</h4>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer group">
                <img src={(claim.postId && claim.postId.image) || "/placeholder.svg"} alt="Foto Barang" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">Foto Barang</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Reasoning */}
            <div className="flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Pemohon</h4>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {claim.userId.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{claim.userId.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{claim.userId.npm}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Alasan Klaim</h4>
                  <div className="relative p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 italic">
                    <span className="absolute -top-2 -left-1 text-4xl text-gray-200 font-serif leading-none">“</span>
                    {claim.reason}
                    <span className="absolute -bottom-4 -right-1 text-4xl text-gray-200 font-serif leading-none">”</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-50">
            {/* Chat/Comment Button */}
            <Button
              variant="ghost"
              onClick={() => {
                if (claim.postId && claim.postId._id) {
                  onViewPost(claim.postId._id)
                } else {
                  toast({ description: "Detail post tidak tersedia", variant: "destructive" })
                }
              }}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Beri Komentar
            </Button>

            <div className="flex-1"></div>

            {claim.status === "pending" && (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => handleAction("reject")}
                  className="flex-1 sm:flex-none border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                >
                  Tolak
                </Button>
                <Button
                  onClick={() => handleAction("approve")}
                  className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                >
                  Setujui Klaim
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showModal && selectedAction && (
        <VerificationModal
          claim={claim}
          action={selectedAction}
          onClose={() => {
            setShowModal(false)
            setSelectedAction(null)
          }}
          onVerify={onVerify}
        />
      )}
    </>
  )
}
