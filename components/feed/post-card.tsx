"use client"

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
  const statusColor =
    post.status === "resolved"
      ? "bg-green-100 text-green-700"
      : post.status === "claimed"
        ? "bg-blue-100 text-blue-700"
        : "bg-yellow-100 text-yellow-700"
  const typeLabel = post.type === "lost" ? "Barang Hilang" : "Barang Ditemukan"
  const typeColor = post.type === "lost" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
    >
      <div className="grid md:grid-cols-3 gap-6 p-6">
        {/* Image */}
        <div className="md:col-span-1">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img src={post.image || "/placeholder.svg"} alt={post.itemName} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            {/* Header with Badges */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColor}`}>{typeLabel}</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                {post.status === "resolved" ? "Selesai" : post.status === "claimed" ? "Diklaim" : "Aktif"}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{post.itemName}</h3>

            {/* Description */}
            <p className="text-gray-700 mb-4 line-clamp-2">{post.description}</p>

            {/* Meta Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{post.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏛️</span>
                <span>{post.faculty}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📂</span>
                <span>{post.category}</span>
              </div>
            </div>
          </div>

          {/* Footer with User Info */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                {post.userId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{post.userId.name}</p>
                <p className="text-xs text-gray-600">{new Date(post.createdAt).toLocaleString("id-ID")}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">❤️</button>
          </div>
        </div>
      </div>
    </div>
  )
}
