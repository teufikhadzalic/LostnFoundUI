"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import CommentSection from "@/components/feed/comment-section"

interface Post {
  _id: string
  itemName: string
  description: string
  category: string
  faculty: string
  location: string
  image: string
  type: "lost" | "found"
  status: string
  createdAt: string
  userId: {
    _id: string
    name: string
    profileImage?: string
  }
}

interface PostDetailModalProps {
  post: Post
  onClose: () => void
  onPostUpdated: () => void
}

export default function PostDetailModal({ post, onClose, onPostUpdated }: PostDetailModalProps) {
  const formatDateTime = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    const dateStr = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    const hh = String(d.getHours()).padStart(2, "0")
    const mm = String(d.getMinutes()).padStart(2, "0")
    const ss = String(d.getSeconds()).padStart(2, "0")
    return `${dateStr} ${hh}:${mm}:${ss}`
  }

  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimReason, setClaimReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const [isOwner, setIsOwner] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    try {
      const user = localStorage.getItem("user")
      if (user) {
        const parsed = JSON.parse(user)
        const postOwnerId = post?.userId?._id ?? post?.userId
        setIsOwner(parsed.id === postOwnerId)
      }
    } catch (e) {
      setIsOwner(false)
    }
  }, [post])

  useEffect(() => {
    // trigger entrance animation
    const t = window.setTimeout(() => setIsMounted(true), 10)
    return () => {
      window.clearTimeout(t)
      setIsMounted(false)
    }
  }, [])

  const handleClaim = async () => {
    if (!claimReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Silakan isi alasan klaim",
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          postId: post._id,
          reason: claimReason,
          ownerPhoto: "https://via.placeholder.com/300",
          npmPhoto: "https://via.placeholder.com/300",
        }),
      })

      if (!res.ok) {
        throw new Error("Gagal membuat klaim")
      }

      toast({
        title: "Berhasil",
        description: "Klaim telah dikirim ke officer untuk verifikasi",
      })

      onPostUpdated()
      setShowClaimForm(false)
      setClaimReason("")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal membuat klaim",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // play close animation then call parent's onClose
    setIsClosing(true)
    setIsMounted(false)
    window.setTimeout(() => {
      onClose()
    }, 220)
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
        isClosing ? "opacity-0" : isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${
          isClosing ? "opacity-0 scale-95" : isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Close Button (sticky & on top) */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 flex justify-end">
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img src={post.image || "/placeholder.svg"} alt={post.itemName} className="w-full h-full object-cover" />
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  post.type === "lost" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                {post.type === "lost" ? "Barang Hilang" : "Barang Ditemukan"}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  post.status === "resolved"
                    ? "bg-green-100 text-green-700"
                    : post.status === "claimed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                {post.status === "resolved" ? "Selesai" : post.status === "claimed" ? "Diklaim" : "Aktif"}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.itemName}</h1>
            <p className="text-gray-700 text-lg mb-6">{post.description}</p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Kategori</p>
                <p className="font-semibold text-gray-900">{post.category}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Lokasi</p>
                <p className="font-semibold text-gray-900">{post.location}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Fakultas</p>
                <p className="font-semibold text-gray-900">{post.faculty}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Waktu</p>
                <p className="font-semibold text-gray-900">{formatDateTime(post.createdAt)}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="border-t border-gray-200 pt-6 pb-6">
              <p className="text-sm text-gray-600 mb-3">Dilaporkan oleh</p>
              <div className="flex items-center gap-3">
                {(() => {
                  const reporterName = post?.userId?.name ?? "Unknown User"
                  const reporterInitial = reporterName && typeof reporterName === "string" && reporterName.length > 0 ? reporterName.charAt(0).toUpperCase() : "?"
                  const reporterId = post?.userId?._id ?? ""
                  return (
                    <>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-bold">
                        {reporterInitial}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{reporterName}</p>
                        <p className="text-sm text-gray-600">{reporterId}</p>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Claim Section */}
            {post.status !== "resolved" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                {!showClaimForm ? (
                  <Button
                    onClick={() => setShowClaimForm(true)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-6"
                  >
                    Klaim Barang Ini
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Alasan Klaim</label>
                      <textarea
                        placeholder="Jelaskan mengapa Anda menganggap barang ini milik Anda atau alasan lainnya..."
                        value={claimReason}
                        onChange={(e) => setClaimReason(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none resize-none"
                        rows={3}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      Note: Officer akan meminta foto Anda dengan barang dan foto NPM untuk verifikasi
                    </p>
                    <div className="flex gap-3">
                      <Button onClick={() => setShowClaimForm(false)} variant="outline" className="flex-1 border-gray-300">
                        Batal
                      </Button>
                      <Button onClick={handleClaim} disabled={loading} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                        {loading ? "Memproses..." : "Kirim Klaim"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Owner actions */}
            {isOwner && (
              <div className="mt-4 flex gap-3">
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const ok = confirm("Yakin ingin menghapus posting ini? Tindakan ini tidak dapat dibatalkan.")
                    if (!ok) return
                    setDeleting(true)
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${post._id}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      })
                      if (!res.ok) throw new Error("Gagal menghapus post")

                      toast({ title: "Berhasil", description: "Posting berhasil dihapus" })
                      onPostUpdated()
                      // animate close then signal parent
                      handleClose()
                    } catch (err) {
                      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal menghapus post" })
                    } finally {
                      setDeleting(false)
                    }
                  }}
                  disabled={deleting}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {deleting ? "Menghapus..." : "Hapus Post"}
                </Button>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  )
}
