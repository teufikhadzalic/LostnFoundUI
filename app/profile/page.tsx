"use client"

import { useEffect, useState } from "react"
import { formatDateTime } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import PostDetailModal from "@/components/feed/post-detail-modal"
import PostDetailDrawer from "@/components/feed/post-detail-drawer"

interface Post {
  _id: string
  itemName: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editNotificationEmail, setEditNotificationEmail] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<any | null>(null)
  const [postLoading, setPostLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setEditName(parsedUser.name || "")
    setEditEmail(parsedUser.email || "")
    setEditNotificationEmail(parsedUser.notificationEmail || "")
    fetchUserPosts(parsedUser.id)
  }, [router])

  const fetchUserPosts = async (userId: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/${userId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

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

  const openPostDetail = async (postId: string) => {
    try {
      setPostLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${postId}`)
      if (!res.ok) throw new Error("Failed to fetch post detail")
      const data = await res.json()
      setSelectedPost(data)
    } catch (err) {
      console.error("Failed to load post detail", err)
      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal memuat detail" })
    } finally {
      setPostLoading(false)
    }
  }

  const handlePostUpdated = () => {
    // refresh list and close modal
    const parsed = localStorage.getItem("user")
    try {
      const id = parsed ? JSON.parse(parsed).id : null
      if (id) fetchUserPosts(id)
    } catch (e) {}
    setSelectedPost(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleEditToggle = () => {
    setEditing((s) => !s)
  }

  const handleSaveProfile = async () => {
    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ name: editName, email: editEmail, notificationEmail: editNotificationEmail }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Gagal menyimpan profil")
      }

      const updated = await res.json()
      localStorage.setItem(
        "user",
        JSON.stringify({ id: updated._id, email: updated.email, name: updated.name, role: updated.role, notificationEmail: updated.notificationEmail || "" }),
      )
      setUser({ id: updated._id, email: updated.email, name: updated.name, role: updated.role, notificationEmail: updated.notificationEmail || "" })
      setEditing(false)
      toast({ title: "Profil diperbarui", description: "Perubahan tersimpan" })
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "Gagal menyimpan" })
    }
  }

  const handleBack = () => {
    try {
      // If there is a history entry, go back. Otherwise navigate to /feed as a safe fallback.
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back()
      } else {
        router.push("/feed")
      }
    } catch (err) {
      router.push("/feed")
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b bg-gray-50/50">
          <Button variant="outline" onClick={handleBack} className="p-2 w-10 h-10 flex items-center justify-center" aria-label="Kembali">
            <span className="text-lg">←</span>
          </Button>
          <h1 className="text-lg font-semibold">Profil Saya</h1>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white text-4xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                {!editing ? (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    <p className="text-sm text-gray-600 mt-2">{user.role === "officer" ? "👮 Officer/Petugas" : "👤 Mahasiswa"}</p>
                  </>
                  ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama</label>
                      <input
                        className="mt-1 block w-full rounded-md border-gray-200"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        className="mt-1 block w-full rounded-md border-gray-200"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Notifikasi (pribadi)</label>
                      <input
                        className="mt-1 block w-full rounded-md border-gray-200"
                        value={editNotificationEmail}
                        onChange={(e) => setEditNotificationEmail(e.target.value)}
                        placeholder="contoh: saya@gmail.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email ini akan digunakan untuk menerima notifikasi via email.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <Button variant="outline" className="border-gray-300 bg-transparent" onClick={handleEditToggle}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSaveProfile} className="bg-green-500 text-white">
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleEditToggle} className="border-gray-300 bg-transparent">
                    Cancel
                  </Button>
                </>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
          <div className="p-4 border-t">
            {!editing && (
              <p className="text-sm text-gray-600">Email notifikasi: {user.notificationEmail || "(belum diatur)"}</p>
            )}
          </div>
      </div>

      {/* Recent Posts + Drawer (two-column layout) */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Post Terbaru Anda</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {loading ? (
              <div>Loading...</div>
            ) : posts.length === 0 ? (
              <p className="text-gray-600">Anda belum membuat post</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => openPostDetail(post._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openPostDetail(post._id)
                    }}
                  >
                    <div className="flex items-center justify-between ">
                      <p className="font-semibold text-gray-900">{post.itemName}</p>
                      <p className="text-sm text-gray-600">{formatDateTime(post.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer column (desktop/tablet) */}
          <div className={`hidden md:block md:relative transition-all overflow-hidden ${selectedPost ? "md:w-96 lg:w-1/3" : "md:w-0" } min-h-[56vh] md:min-h-[64vh]`}>
            <PostDetailDrawer post={selectedPost} onClose={() => setSelectedPost(null)} onPostUpdated={handlePostUpdated} />
          </div>
          {/* Mobile: use the modal for full-screen UX */}
          {selectedPost && (
            <div className="md:hidden">
              <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} onPostUpdated={handlePostUpdated} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
