"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { formatDateTime } from "@/lib/formatDate"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Send, Trash2, MessageCircle } from "lucide-react"

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
    <div className="flex flex-col h-full bg-gray-50/50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-sm">
        <MessageCircle className="w-4 h-4" />
        <h3>Diskusi ({comments.length})</h3>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent max-h-[400px]">
        {comments.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-white">
            <p className="text-gray-400 font-medium text-sm">Belum ada diskusi.</p>
            <p className="text-xs text-gray-400">Jadilah yang pertama memberikan informasi!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="group flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm flex-shrink-0 border border-white">
                {comment.userId.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">{comment.userId.name}</span>
                  <span className="text-[10px] text-gray-400">{formatDateTime(comment.createdAt)}</span>
                </div>
                <div className="bg-white p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm text-sm text-gray-700 border border-gray-100 relative group-hover:shadow-md transition-shadow">
                  {comment.text}
                </div>
                {user?._id === comment.userId._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-[10px] text-red-500 hover:text-red-700 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Comment Input */}
      <div className="relative mt-auto">
        <form onSubmit={handleAddComment} className="relative flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="relative flex-1">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar..."
              className="w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-sm transition-all shadow-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !newComment.trim()}
              className="absolute right-1 top-1 h-7 w-7 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
