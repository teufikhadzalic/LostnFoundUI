"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Post {
  _id: string
  itemName: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white text-4xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <p className="text-sm text-gray-600 mt-2">
                {user.role === "officer" ? "👮 Officer/Petugas" : "👤 Mahasiswa"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300 bg-transparent">
              Edit Profile
            </Button>
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

      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Post Terbaru Anda</h2>
        {loading ? (
          <div>Loading...</div>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">Anda belum membuat post</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{post.itemName}</p>
                  <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
