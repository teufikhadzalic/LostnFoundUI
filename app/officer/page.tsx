"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ClaimVerificationCard from "@/components/officer/claim-verification-card"

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

export default function OfficerPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState<"pending" | "all">("pending")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "officer") {
      router.push("/feed")
      return
    }

    setUser(parsedUser)
    fetchClaims()
  }, [router])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/officer/pending-claims`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.ok) {
        const data = await res.json()
        setClaims(data)
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat klaim",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredClaims = filter === "pending" ? claims.filter((c) => c.status === "pending") : claims

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    approved: claims.filter((c) => c.status === "approved").length,
    rejected: claims.filter((c) => c.status === "rejected").length,
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Officer - Verifikasi Klaim</h1>
        <p className="text-gray-600 mt-2">Verifikasi klaim barang yang dikirim oleh mahasiswa</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Klaim</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-yellow-200 p-6">
          <p className="text-sm text-yellow-700 mb-2">Menunggu</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-6">
          <p className="text-sm text-green-700 mb-2">Disetujui</p>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <p className="text-sm text-red-700 mb-2">Ditolak</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          onClick={() => setFilter("pending")}
          className={`${
            filter === "pending"
              ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
          } font-semibold`}
        >
          Klaim Menunggu ({stats.pending})
        </Button>
        <Button
          onClick={() => setFilter("all")}
          variant="outline"
          className={`${
            filter === "all" ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-400" : "border-gray-300"
          } font-semibold`}
        >
          Semua Klaim ({stats.total})
        </Button>
      </div>

      {/* Claims List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading claims...</div>
        ) : filteredClaims.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-600">
            {filter === "pending" ? "Tidak ada klaim yang menunggu verifikasi" : "Tidak ada klaim"}
          </div>
        ) : (
          filteredClaims.map((claim) => (
            <ClaimVerificationCard
              key={claim._id}
              claim={claim}
              onVerify={(status) => {
                setClaims((prev) => prev.map((c) => (c._id === claim._id ? { ...c, status } : c)))
                fetchClaims()
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
