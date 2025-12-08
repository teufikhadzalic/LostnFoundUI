"use client"

import { formatDateTime } from "@/lib/formatDate"
import { MapPin, Building2, Tag, ArrowRight } from "lucide-react"

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

interface PostCardProps {
  post: Post
  onClick: () => void
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const isLost = post.type === "lost"
  const isResolved = post.status === "resolved"
  const isClaimed = post.status === "claimed"

  // Refined badge colors
  const typeBadgeClass = isLost
    ? "bg-red-50 text-red-600 ring-1 ring-red-500/10"
    : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10"

  const statusBadgeClass = isResolved
    ? "bg-gray-100 text-gray-600 ring-1 ring-gray-500/10"
    : isClaimed
      ? "bg-blue-50 text-blue-600 ring-1 ring-blue-500/10"
      : "bg-amber-50 text-amber-600 ring-1 ring-amber-500/10"

  const statusLabel = isResolved ? "Selesai" : isClaimed ? "Diklaim" : "Aktif"

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section - Larger Focus */}
        <div className="md:w-1/3 relative overflow-hidden h-64 md:h-auto">
          <div className="absolute inset-0 bg-gray-100">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.itemName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {/* Overlay gradient for text readability on mobile if needed, usually clean is better */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md bg-white/90 ${typeBadgeClass}`}>
              {isLost ? "Hilang" : "Ditemukan"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${statusBadgeClass}`}>
                {statusLabel}
              </span>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                {formatDateTime(post.createdAt)}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-yellow-500 transition-colors">
              {post.itemName}
            </h3>

            <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
              {post.description}
            </p>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {post.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                {post.faculty}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                {post.category}
              </div>
            </div>
          </div>

          {/* Footer: User & Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {post.userId.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{post.userId.name}</span>
                <span className="text-[10px] text-gray-400">Mahasiswa</span>
              </div>
            </div>

            <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-400 group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
