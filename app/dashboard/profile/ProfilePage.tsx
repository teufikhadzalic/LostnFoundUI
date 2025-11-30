"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { UserAvatar } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, Phone, Calendar, Camera, Award, Zap, Edit2, Star, Heart, MessageSquare, ArrowLeft } from "lucide-react"
import { FACULTIES } from "@/lib/constants"

const mockUser = {
  id: "1",
  name: "Ahmad Rizki",
  email: "ahmad@ui.ac.id",
  phone: "081234567890",
  faculty: "Fakultas Teknik",
  avatarUrl: "",
  role: "student",
  createdAt: new Date("2024-01-15"),
  bio: "Mahasiswa teknik yang peduli dengan keamanan barang kampus",
  stats: {
    itemsPosted: 12,
    itemsFound: 8,
    successRate: 85,
    rating: 4.8,
    reviews: 24,
  },
  achievements: [
    { name: "Finder Hero", description: "5 items found", icon: "star" },
    { name: "Reporter", description: "Posted 10+ items", icon: "zap" },
    { name: "Trusted User", description: "100% success rate", icon: "award" },
  ],
}

export default function ProfilePage() {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    faculty: mockUser.faculty,
    bio: mockUser.bio,
  })

  const handleSave = () => {
    console.log("Profile updated:", formData)
    setIsEditOpen(false)
  }

  const handleActivityClick = (itemId: string) => {
    router.push(`/dashboard/items/${itemId}`)
  }

  return (
    <DashboardLayout user={mockUser} notificationCount={3} onLogout={() => {}}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        {/* Profile Header */}
        <Card className="overflow-hidden border-slate-800/50">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />

          {/* Profile Info */}
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 mb-6">
              <div className="relative">
                <UserAvatar
                  name={mockUser.name}
                  avatarUrl={mockUser.avatarUrl}
                  size="lg"
                  className="h-24 w-24 border-4 border-slate-900"
                />
                <button className="absolute bottom-0 right-0 bg-primary text-slate-900 rounded-full p-2 hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{mockUser.name}</h1>
                <p className="text-slate-400">{mockUser.faculty}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : "text-slate-600"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">
                    {mockUser.stats.rating} ({mockUser.stats.reviews} reviews)
                  </span>
                </div>
              </div>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-slate-900">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profil
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nama</label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fakultas</label>
                      <Select
                        value={formData.faculty}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            faculty: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Pilih fakultas" />
                        </SelectTrigger>
                        <SelectContent>
                          {FACULTIES.map((fac) => (
                            <SelectItem key={fac} value={fac}>
                              {fac}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telepon</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-slate-900">
                      Simpan Perubahan
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Bio */}
            {mockUser.bio && <p className="text-muted-foreground mb-6">{mockUser.bio}</p>}

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-slate-800/50">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{mockUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <p className="text-sm font-medium">{mockUser.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Bergabung</p>
                  <p className="text-sm font-medium">{mockUser.createdAt.toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
            <TabsTrigger value="achievements">Pencapaian</TabsTrigger>
            <TabsTrigger value="activity">Aktivitas</TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Items Posted",
                  value: mockUser.stats.itemsPosted,
                  icon: Zap,
                },
                {
                  label: "Items Found",
                  value: mockUser.stats.itemsFound,
                  icon: Heart,
                },
                {
                  label: "Success Rate",
                  value: `${mockUser.stats.successRate}%`,
                  icon: Award,
                },
                {
                  label: "Total Reviews",
                  value: mockUser.stats.reviews,
                  icon: MessageSquare,
                },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <Card key={idx} className="bg-slate-900/50 border-slate-800/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        </div>
                        <Icon className="h-8 w-8 text-primary/30" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockUser.achievements.map((achievement, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <div className="mb-3 flex justify-center">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Posted item",
                      item: "iPhone 13 Pro Max",
                      time: "2 hari lalu",
                      itemId: "item-1",
                    },
                    {
                      action: "Found item",
                      item: "Dompet Kulit Hitam",
                      time: "5 hari lalu",
                      itemId: "item-2",
                    },
                    {
                      action: "Received review",
                      item: "5 stars - Great finder!",
                      time: "1 minggu lalu",
                      itemId: null,
                    },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 pb-4 border-b border-slate-800/50 last:border-0 ${activity.itemId ? "cursor-pointer hover:bg-slate-800/30 p-2 rounded" : ""}`}
                      onClick={() => activity.itemId && handleActivityClick(activity.itemId)}
                    >
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.item}</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
