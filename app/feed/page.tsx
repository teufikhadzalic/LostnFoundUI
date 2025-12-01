"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import PostCard from "@/components/feed/post-card"
import CreatePostModal from "@/components/feed/create-post-modal"
import PostDetailModal from "@/components/feed/post-detail-modal"

const FACULTIES = [
  "Ilmu Komputer",
  "Kedokteran Gigi",
  "Ilmu Administrasi",
  "Kesehatan Masyarakat",
  "Psikologi",
  "Ilmu Keperawatan",
  "Kedokteran",
  "Ekonomi dan Bisnis",
  "Hukum",
  "Ilmu Sosial dan Ilmu Politik",
  "Ilmu Pengetahuan Budaya",
  "Matematika dan Ilmu Pengetahuan Alam",
  "Teknik",
  "Farmasi",
]

const CATEGORIES = ["Elektronik", "Dokumen", "Tas & Dompet", "Kunci", "Pakaian", "Alat Tulis", "Lainnya"]

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

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    faculty: "",
    category: "",
    type: "",
    search: "",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.faculty) params.append("faculty", filters.faculty)
      if (filters.category) params.append("category", filters.category)
      if (filters.type) params.append("type", filters.type)
      if (filters.search) params.append("search", filters.search)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (err) {
      console.error("Failed to fetch posts", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handlePostCreated = () => {
    setShowCreateModal(false)
    fetchPosts()
  }

  return (
    <div className="space-y-6 border-gray-200 ">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 pt-6 pb-4 z-10 bor">
        <h1 className="text-3xl font-bold text-gray-900">Timeline Lost & Found</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
        >
          + Buat Laporan
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Cari</label>
            <Input
              placeholder="Nama barang..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Tipe</label>
            <Select value={filters.type} onValueChange={(val) => handleFilterChange("type", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="lost">Barang Hilang</SelectItem>
                <SelectItem value="found">Barang Ditemukan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Faculty Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Fakultas</label>
            <Select value={filters.faculty} onValueChange={(val) => handleFilterChange("faculty", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Fakultas</SelectItem>
                {FACULTIES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Kategori</label>
            <Select value={filters.category} onValueChange={(val) => handleFilterChange("category", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              onClick={() => setFilters({ faculty: "", category: "", type: "", search: "" })}
              variant="outline"
              className="w-full border-gray-300"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-600">
            Tidak ada post ditemukan. Coba ubah filter atau buat post baru.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onClick={() => setSelectedPost(post)} />)
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} onPostCreated={handlePostCreated} />
      )}

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} onPostUpdated={fetchPosts} />
      )}
    </div>
  )
}
