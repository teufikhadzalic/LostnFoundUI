"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import CommentSection from "@/components/feed/comment-section"
import { formatDateTime } from "@/lib/formatDate"

interface Post {
  _id: string
  itemName: string
  description: string
  category: string
  faculty: string
  location: string
  image?: string
  type: "lost" | "found"
  status: string
  createdAt: string
  userId: {
    _id: string
    name: string
    profileImage?: string
  }
}

interface Props {
  post?: Post | null
  onClose: () => void
  onPostUpdated: () => void
}

export default function PostDetailDrawer({ post, onClose, onPostUpdated }: Props) {
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [matching, setMatching] = useState(false)
  const [matchMode, setMatchMode] = useState<"unknown" | "ai" | "heuristic">("unknown")
  const [isClosing, setIsClosing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Keep hooks order stable by calling useEffect always; guard body when post is not available
    if (!post) {
      setIsOwner(false)
      setIsMounted(false)
      return
    }

    try {
      const user = localStorage.getItem("user")
      if (user) {
        const parsed = JSON.parse(user)
        setIsOwner(parsed.id === post.userId._id || parsed.id === post.userId)
      }
    } catch (e) {
      setIsOwner(false)
    }
  }, [post])

  // Keep drawer mounted so layout and hook order remain stable; render a placeholder state when closed
  const handleDelete = async () => {
    const ok = confirm("Yakin ingin menghapus posting ini? Tindakan ini tidak dapat dibatalkan.")
    if (!ok) return
    setDeleting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${post?._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (!res || !res.ok) throw new Error("Gagal menghapus post")
      toast({ title: "Berhasil", description: "Posting berhasil dihapus" })
      onPostUpdated()
      // animate close then notify parent
      setIsClosing(true)
      setTimeout(() => onClose(), 220)
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal menghapus post" })
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    // when post becomes available, mark mounted to allow entrance animation
    if (post) {
      // fetch server-side matching mode (AI enabled or heuristic)
      ;(async () => {
        try {
          const modeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/match/mode`)
          if (modeRes && modeRes.ok) {
            const md = await modeRes.json()
            setMatchMode(md?.mode === "ai" ? "ai" : "heuristic")
          } else {
            setMatchMode("heuristic")
          }
        } catch (e) {
          setMatchMode("heuristic")
        }
      })()
      // allow the transform to start from off-screen then animate in
      const t = window.setTimeout(() => setIsMounted(true), 10)
      return () => window.clearTimeout(t)
    }
    return
  }, [post])

  const handleClose = () => {
    setIsClosing(true)
    setIsMounted(false)
    setTimeout(() => onClose(), 220)
  }

  return (
    <aside
      className={`w-full md:max-w-md lg:max-w-lg bg-white h-full shadow-xl transform transition-all duration-300 ease-out ${
        // slide + fade in/out
        post && !isClosing && isMounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } md:absolute md:inset-y-0 md:right-0 md:top-0`}
    >
      {/* Invisible placeholder when no post is selected, keeps drawer mounted for stable hook order */}
      {!post && <div aria-hidden className="invisible w-full h-full"></div>}

      <div className="p-4 h-full overflow-y-auto">
        {post ? (
          <>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{post.itemName}</h3>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mt-4">
              {/* Reduce image height so more detail is visible without scrolling */}
              <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img src={post.image || "/placeholder.svg"} alt={post.itemName} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.type === "lost" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {post.type === "lost" ? "Barang Hilang" : "Barang Ditemukan"}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.status === "resolved" ? "bg-green-100 text-green-700" : post.status === "claimed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {post.status === "resolved" ? "Selesai" : post.status === "claimed" ? "Diklaim" : "Aktif"}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">{post.itemName}</h2>
              <p className="text-gray-700 text-sm mb-4">{post.description}</p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Kategori</p>
                  <p className="font-semibold">{post.category}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Lokasi</p>
                  <p className="font-semibold">{post.location}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Fakultas</p>
                  <p className="font-semibold">{post.faculty}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Waktu</p>
                  <p className="font-semibold">{formatDateTime(post.createdAt)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-600 mb-2">Dilaporkan oleh</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-bold">
                    {post.userId.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{post.userId.name}</p>
                    <p className="text-xs text-gray-600">{post.userId._id}</p>
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="mt-4">
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="w-full">
                    {deleting ? "Menghapus..." : "Hapus Post"}
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <div className="mb-2 text-xs text-gray-600">Mode matching: <span className={`font-semibold ${matchMode === "ai" ? "text-green-600" : "text-gray-600"}`}>{matchMode === "ai" ? "AI" : "Heuristic"}</span></div>
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white"
                  onClick={async () => {
                    if (!post) return
                    setMatching(true)
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/match/post/${post._id}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data.error || "Gagal melakukan matching")
                      const heuristicCount = Array.isArray(data.heuristicMatches) ? data.heuristicMatches.length : 0
                      const aiCount = Array.isArray(data.aiMatches) ? data.aiMatches.length : 0
                      const total = data.matched ?? (heuristicCount + aiCount)
                      const modeText = data?.mode || (matchMode === "ai" ? "AI" : "Heuristic")
                      toast({ title: "Matching selesai", description: `Mode: ${modeText} — Heuristic: ${heuristicCount}, AI: ${aiCount}, Total: ${total}` })
                      console.log("Match details:", data)
                    } catch (err) {
                      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal melakukan matching" })
                    } finally {
                      setMatching(false)
                    }
                  }}
                  disabled={matching}
                >
                  {matching ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    "Cek Kecocokan"
                  )}
                </button>
              </div>

              <div className="mt-6">
                <CommentSection postId={post._id} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-sm text-gray-500 py-6">Select a post to view details</div>
        )}
      </div>
    </aside>
  )
}
