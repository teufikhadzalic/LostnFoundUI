"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import CommentSection from "@/components/feed/comment-section"
import { X, MapPin, Building2, Tag, Calendar, AlertTriangle, Trash2, ShieldCheck, CheckCircle2 } from "lucide-react"

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
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimReason, setClaimReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const [isOwner, setIsOwner] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [matchResults, setMatchResults] = useState<any>(null)
  const [loadingMatch, setLoadingMatch] = useState(false)

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
    // Reset match results when post changes
    setMatchResults(null)
  }, [post])

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const handleRunMatch = async () => {
    setLoadingMatch(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/match/post/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ dryRun: true }),
      })

      if (res.ok) {
        const data = await res.json()
        // The backend returns { combinedMatches: [{ id, score }] }
        // We need to fetch details for these matches or assume backend returns enough info?
        // Backend currently returns { cand, score } but mapped to { id, score } in res.json
        // Wait, match.js line 199: combined = matches.map((m) => ({ id: m.cand._id, score: m.score }))
        // It DOES NOT return candidate details (name, image).
        // I should update match.js to return candidate details OR fetch them here.
        // Let's update match.js first to be efficient, but I already approved updates. 
        // Let's look at match.js again.
        // It returns `combinedMatches: matches.map(...)`.
        // I should update match.js to return full candidate details for UI.

        // For now, let's assume I will update match.js in next step or use what I have.
        // Actually, to make this work nicely, I need match.js to return `cand` object.

        // But let's finish the frontend function structure first.
        setMatchResults(data.combinedMatches || [])
        if (data.matched === 0) {
          toast({ description: "Belum ada postingan yang mirip ditemukan." })
        }
      } else {
        toast({ variant: "destructive", description: "Gagal menjalankan pencarian AI" })
      }
    } catch (e) {
      toast({ variant: "destructive", description: "Terjadi kesalahan" })
    } finally {
      setLoadingMatch(false)
    }
  }



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
        }),
      })

      if (!res.ok) throw new Error("Gagal membuat klaim")

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

  const handleDelete = async () => {
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
      onClose()
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal menghapus post" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
      <div
        className={`bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl transition-transform duration-300 ${isMounted ? "scale-100" : "scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-20 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image (Full Height on Desktop) */}
        <div className="md:w-1/2 bg-black flex items-center justify-center relative bg-pattern">
          <div className="absolute inset-0 bg-black/20" />
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.itemName}
            className="max-h-full max-w-full object-contain relative z-10"
          />

          {/* Status Badge Overlay */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md ${post.type === 'lost' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'
              }`}>
              {post.type === 'lost' ? 'Barang Hilang' : 'Barang Ditemukan'}
            </span>
          </div>
        </div>

        {/* Right Side: Info & Comments */}
        <div className="md:w-1/2 flex flex-col h-full bg-white relative">
          {/* Header Info (Sticky) */}
          <div className="p-6 border-b border-gray-100 flex-shrink-0 bg-white z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{post.itemName}</h1>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateTime(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                    <MapPin className="w-3.5 h-3.5" />
                    {post.location}
                  </div>
                </div>
              </div>

              {/* Close Button Desktop */}
              <button onClick={onClose} className="hidden md:flex text-gray-400 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile Mini */}
            <div className="flex flex-col gap-3">
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                    onClick={() => handleRunMatch()}
                    disabled={loadingMatch}
                  >
                    {loadingMatch ? "Memproses..." : "🔍 Cek Kecocokan AI"}
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {post.userId?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{post.userId?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">Pelapor</p>
                </div>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* AI Match Results */}
          {matchResults && matchResults.length > 0 && (
            <div className="bg-indigo-50 border-b border-indigo-100 p-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                  ✨ Rekomendasi AI ({matchResults.length})
                </h3>
                <button
                  onClick={() => setMatchResults(null)}
                  className="text-indigo-400 hover:text-indigo-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {matchResults.map((match: any) => (
                  <div key={match.id} className="bg-white rounded-lg p-3 border border-indigo-100 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={match.cand?.image || "/placeholder.svg"}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{match.cand?.itemName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${match.score > 0.8 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {(match.score * 100).toFixed(0)}% Match
                        </span>
                        <span className="text-xs text-gray-400">• {formatDateTime(match.cand?.createdAt).split(',')[0]}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="self-center"
                      onClick={() => window.open(`/feed?postId=${match.id}`, '_blank')}
                    >
                      Lihat
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 p-3 rounded-xl">
                  <span className="text-xs text-gray-400 block mb-1">Kategori</span>
                  <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <Tag className="w-4 h-4 text-yellow-500" />
                    {post.category}
                  </div>
                </div>
                <div className="border border-gray-100 p-3 rounded-xl">
                  <span className="text-xs text-gray-400 block mb-1">Fakultas</span>
                  <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <Building2 className="w-4 h-4 text-yellow-500" />
                    {post.faculty}
                  </div>
                </div>
              </div>

              {/* Claim Action Area */}
              {post.status !== "resolved" && !isOwner && (
                <div className={`rounded-xl p-6 transition-all ${showClaimForm ? 'bg-white border-2 border-yellow-400 shadow-xl' : 'bg-yellow-50 border border-yellow-200'}`}>
                  {!showClaimForm ? (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-yellow-400/30">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {post.type === 'lost' ? "Anda menemukan barang ini?" : "Barang ini milik Anda?"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {post.type === 'lost'
                          ? "Beritahu pemilik bahwa Anda telah menemukannya."
                          : "Ajukan klaim kepemilikan untuk diverifikasi oleh officer."}
                      </p>
                      <Button
                        onClick={() => setShowClaimForm(true)}
                        className="w-full bg-gray-900 text-white hover:bg-black rounded-lg h-11 font-bold shadow-lg"
                      >
                        {post.type === 'lost' ? "Saya Menemukannya" : "Ajukan Klaim"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Form Pengajuan Klaim</h3>
                        <button onClick={() => setShowClaimForm(false)} className="text-gray-400 hover:text-gray-900"><X className="w-4 h-4" /></button>
                      </div>

                      <textarea
                        placeholder={post.type === 'lost'
                          ? "Jelaskan kondisi barang yang Anda temukan dan di mana Anda menyimpannya saat ini..."
                          : "Jelaskan secara detail kenapa barang ini milik Anda (ciri khusus, isi, dll)..."
                        }
                        value={claimReason}
                        onChange={(e) => setClaimReason(e.target.value)}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-yellow-400 focus:ring-0 outline-none resize-none text-sm h-32"
                      />



                      <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          {post.type === 'lost'
                            ? "Officer akan memverifikasi laporan penemuan Anda."
                            : "Officer akan memverifikasi klaim Anda berdasarkan deskripsi dan foto bukti yang dilampirkan."}
                        </span>
                      </div>

                      <Button
                        onClick={handleClaim}
                        disabled={loading}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold h-11"
                      >
                        {loading ? "Mengirim..." : "Kirim Pengajuan"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {post.status === 'resolved' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <p className="font-bold">Masalah Terselesaikan</p>
                    <p className="text-xs">Barang ini telah dikembalikan kepada pemiliknya.</p>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Diskusi</h3>
                <CommentSection postId={post._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
