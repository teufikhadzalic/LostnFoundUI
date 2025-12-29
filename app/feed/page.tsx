"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PostCard from "@/components/feed/post-card"
import CreatePostModal from "@/components/feed/create-post-modal"
import PostDetailModal from "@/components/feed/post-detail-modal"
import FilterSidebar from "@/components/feed/filter-sidebar"

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
    status: "",
    search: "",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false) // For mobile view

  const searchParams = useSearchParams()
  const postIdParam = searchParams.get("postId")

  useEffect(() => {
    fetchPosts()
  }, [filters])

  useEffect(() => {
    if (postIdParam) {
      const existing = posts.find((p) => p._id === postIdParam)
      if (existing) {
        setSelectedPost(existing)
      } else {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${postIdParam}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data && !data.error) setSelectedPost(data)
          })
          .catch(err => console.error("Failed to load deep-linked post", err))
      }
    }
  }, [postIdParam, posts])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.faculty) params.append("faculty", filters.faculty)
      if (filters.category) params.append("category", filters.category)
      if (filters.type) params.append("type", filters.type)
      if (filters.status) params.append("status", filters.status)
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
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 pb-4 pt-4 md:pt-0">
        <h1 className="text-3xl font-bold text-gray-900">Timeline Lost & Found</h1>
        <div className="flex items-center gap-2">
          <Button
            className="md:hidden"
            variant="outline"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            Filter
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold flex-1 md:flex-none"
          >
            + Buat Laporan
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:block col-span-1 bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Mobile Filters (Collapsible) */}
        {isMobileFiltersOpen && (
          <div className="md:hidden bg-white p-6 rounded-xl border border-gray-200 mb-4">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Right Feed Area */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Search Bar (kept in main area or sidebar? Usually search is top, but let's put it on top of list for easy access) */}
          <div className="relative">
            <Input
              placeholder="Cari barang (nama atau deskripsi)..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Posts */}
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
