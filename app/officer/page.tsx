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
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    const parseJwt = (tkn: string | null) => {
      if (!tkn) return null
      try {
        const parts = tkn.split('.')
        if (parts.length < 2) return null
        const payload = parts[1]
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
          atob(b64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join(''),
        )
        return JSON.parse(json)
      } catch (e) {
        return null
      }
    }

    if (!userData) {
      // try to recover role from token if available
      const decoded = parseJwt(token)
      if (decoded?.role === 'officer') {
        setUser({ userId: decoded.userId, role: decoded.role })
        fetchClaims()
        return
      }
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!parsedUser.role) {
      const decoded = parseJwt(token)
      if (decoded?.role) parsedUser.role = decoded.role
    }

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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/officer/claims`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!res.ok) {
        // Try to parse error body, but fall back to status text
        let errBody = null
        try {
          errBody = await res.json()
        } catch (e) {
          /* ignore */
        }

        if (res.status === 401) {
          // Not authenticated
          toast({ variant: "destructive", title: "Unauthorized", description: "Please login again" })
          router.push("/login")
          return
        }
        if (res.status === 403) {
          // Not an officer
          toast({ variant: "destructive", title: "Forbidden", description: "Officer access required" })
          router.push("/feed")
          return
        }

        toast({ variant: "destructive", title: "Error", description: errBody?.error || "Gagal memuat klaim" })
        return
      }

      // Success
      const data = await res.json()
      setClaims(data)
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

  // Updated filter logic
  const filteredClaims = filter === "all" ? claims : claims.filter((c) => c.status === filter)

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

      {/* Stats Grid (Clickable) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* All Claims */}
        <div
          onClick={() => setFilter("all")}
          className={`cursor-pointer bg-white rounded-xl border p-6 transition hover:shadow-md ${filter === 'all' ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-gray-200'}`}
        >
          <p className="text-sm text-gray-600 mb-2">Total Klaim</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        {/* Pending */}
        <div
          onClick={() => setFilter("pending")}
          className={`cursor-pointer bg-white rounded-xl border p-6 transition hover:shadow-md ${filter === 'pending' ? 'border-yellow-400 ring-2 ring-yellow-400/20 bg-yellow-50' : 'border-yellow-200'}`}
        >
          <p className="text-sm text-yellow-700 mb-2">Menunggu</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>

        {/* Approved */}
        <div
          onClick={() => setFilter("approved")}
          className={`cursor-pointer bg-white rounded-xl border p-6 transition hover:shadow-md ${filter === 'approved' ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50' : 'border-green-200'}`}
        >
          <p className="text-sm text-green-700 mb-2">Disetujui</p>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setFilter("rejected")}
          className={`cursor-pointer bg-white rounded-xl border p-6 transition hover:shadow-md ${filter === 'rejected' ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50' : 'border-red-200'}`}
        >
          <p className="text-sm text-red-700 mb-2">Ditolak</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Status Text */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {filter === "all" && "Semua Klaim"}
          {filter === "pending" && "Menunggu Verifikasi"}
          {filter === "approved" && "Klaim Disetujui"}
          {filter === "rejected" && "Klaim Ditolak"}
        </h2>
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
