"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import VerificationModal from "@/components/officer/verification-modal"

interface Claim {
  _id: string
  postId: {
    _id: string
    itemName: string
    image: string
  }
  userId: {
    _id: string
    name: string
    npm: string
    profileImage?: string
  }
  reason: string
  ownerPhoto: string
  npmPhoto: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface ClaimVerificationCardProps {
  claim: Claim
  onVerify: (status: "approved" | "rejected") => void
}

export default function ClaimVerificationCard({ claim, onVerify }: ClaimVerificationCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null)

  const handleAction = (action: "approve" | "reject") => {
    setSelectedAction(action)
    setShowModal(true)
  }

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }

  const statusLabel = {
    pending: "Menunggu Verifikasi",
    approved: "Disetujui",
    rejected: "Ditolak",
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{claim.postId.itemName}</h3>
              <p className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2 ${statusColor[claim.status]}`}>
                {statusLabel[claim.status]}
              </p>
            </div>
            <p className="text-sm text-gray-600">{new Date(claim.createdAt).toLocaleString("id-ID")}</p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Item Image */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Foto Barang</p>
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={claim.postId.image || "/placeholder.svg"}
                  alt={claim.postId.itemName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Owner Photo */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Foto Pemilik + Barang</p>
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={claim.ownerPhoto || "/placeholder.svg"}
                  alt="Pemilik dengan barang"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* NPM Photo */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Foto Kartu NPM</p>
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={claim.npmPhoto || "/placeholder.svg"}
                  alt="Kartu NPM"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Claimant Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Data Pemohon</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Nama:</span> {claim.userId.name}
                </p>
                <p>
                  <span className="font-semibold">NPM:</span> {claim.userId.npm}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Alasan Klaim</p>
              <p className="text-sm text-gray-700">{claim.reason}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {claim.status === "pending" && (
            <div className="flex gap-3">
              <Button
                onClick={() => handleAction("reject")}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                Tolak
              </Button>
              <Button
                onClick={() => handleAction("approve")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Setujui
              </Button>
            </div>
          )}
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
