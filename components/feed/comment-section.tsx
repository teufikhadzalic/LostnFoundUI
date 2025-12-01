"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { formatDateTime } from "@/lib/formatDate"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  _id: string
  text: string
  createdAt: string
  userId: {
    _id: string
    name: string
    profileImage?: string
  }
}

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) setUser(JSON.parse(userData))
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/comments/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (err) {
      console.error("Failed to fetch comments", err)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ postId, text: newComment }),
      })

      if (res.ok) {
        const createdComment = await res.json()
        const commentWithUser = {
          ...createdComment,
          userId: user,
        }
        setComments([commentWithUser, ...comments])
        setNewComment("")
        toast({
          title: "Berhasil",
          description: "Komentar berhasil ditambahkan",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan komentar",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId))
        toast({
          title: "Berhasil",
          description: "Komentar berhasil dihapus",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus komentar",
      })
    }
  }

  return (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-bold text-gray-900">Komentar & Tips</h3>

      {/* New Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Bagikan tips atau tanya jawab tentang barang ini..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
          >
            {loading ? "Memproses..." : "Kirim Komentar"}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Belum ada komentar. Jadilah yang pertama!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {comment.userId.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{comment.userId.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-600">{formatDateTime(comment.createdAt)}</p>
                      {user?._id === comment.userId._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
