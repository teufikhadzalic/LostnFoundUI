"use client"

import { useEffect, useState, useRef } from "react"
import { formatDateTime } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import PostDetailModal from "@/components/feed/post-detail-modal"
import PostCard from "@/components/feed/post-card"
import { Settings, LogOut, ArrowLeft, Mail, User as UserIcon, Shield, Edit2, Camera } from "lucide-react"

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
  userId: string // API returns ID string here
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editNotificationEmail, setEditNotificationEmail] = useState("")
  const [editProfileImage, setEditProfileImage] = useState("") // Store base64 string

  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
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
    setEditProfileImage(parsedUser.profileImage || "")
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

  const handlePostUpdated = () => {
    const parsed = localStorage.getItem("user")
    if (parsed) {
      fetchUserPosts(JSON.parse(parsed).id)
    }
    setSelectedPost(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          notificationEmail: editNotificationEmail,
          profileImage: editProfileImage // Send updated image
        }),
      })

      if (!res.ok) {
        throw new Error("Gagal menyimpan profil")
      }

      const updated = await res.json()
      localStorage.setItem(
        "user",
        JSON.stringify({ ...updated, id: updated._id })
      )
      setUser({ ...updated, id: updated._id })
      setEditing(false)
      toast({ title: "Profil diperbarui", description: "Perubahan tersimpan" })
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menyimpan perubahan" })
    }
  }

  if (!user) return <div className="p-8 text-center">Loading...</div>

  // Prepare post object for PostCard (injecting user details to match expected prop structure)
  const enrichedPosts = posts.map(p => ({
    ...p,
    userId: {
      _id: user.id || user._id,
      name: user.name,
      profileImage: user.profileImage
    }
  }))

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header / Profile Card */}
      <div className="relative bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div
                className={`w-32 h-32 rounded-3xl bg-white p-2 shadow-lg ${editing ? 'cursor-pointer' : ''}`}
                onClick={() => editing && fileInputRef.current?.click()}
              >
                <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-5xl font-bold text-gray-400 overflow-hidden relative">
                  {editing ? (
                    // Show preview if editing
                    editProfileImage ? (
                      <img src={editProfileImage} alt="" className="w-full h-full object-cover" />
                    ) : user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )
                  ) : (
                    // Show current user image
                    user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )
                  )}

                  {/* Overlay for editing */}
                  {editing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Info & Actions */}
            <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
              <div>
                {!editing ? (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'officer' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {user.role === 'officer' ? '👮 Officer' : '👤 Mahasiswa'}
                      </span>
                      {user.notificationEmail && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          Notifikasi Aktif
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 w-full md:w-96">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="p-3 rounded-xl border border-gray-300 focus:border-yellow-400 outline-none"
                    />
                    <input
                      value={editNotificationEmail}
                      onChange={(e) => setEditNotificationEmail(e.target.value)}
                      placeholder="Email Notifikasi"
                      className="p-3 rounded-xl border border-gray-300 focus:border-yellow-400 outline-none"
                    />
                    <p className="text-xs text-gray-500">Email untuk menerima notifikasi update status laporan.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!editing ? (
                  <>
                    <Button onClick={() => setEditing(true)} variant="outline" className="rounded-xl border-gray-300">
                      <Settings className="w-4 h-4 mr-2" /> Setting
                    </Button>
                    <Button onClick={handleLogout} variant="ghost" className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => {
                      setEditing(false)
                      setEditProfileImage(user.profileImage || "") // Reset changes
                    }} variant="ghost" className="rounded-xl">
                      Batal
                    </Button>
                    <Button onClick={handleSaveProfile} className="rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold">
                      Simpan Perubahan
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs/Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Riwayat Laporan</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-bold">{posts.length}</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <p className="text-gray-500 font-medium">Belum ada riwayat laporan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  )
}
