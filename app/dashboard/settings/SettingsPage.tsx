"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Bell, Lock, Trash2, LogOut } from "lucide-react"

const mockUser = {
  id: "1",
  name: "Ahmad Rizki",
  email: "ahmad@ui.ac.id",
  role: "student",
  faculty: "Teknik",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    claimUpdates: true,
    newMessages: true,
    itemMatches: true,
    weeklyReport: false,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showStats: true,
    allowMessages: true,
  })

  return (
    <DashboardLayout user={mockUser} notificationCount={0} onLogout={() => {}}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Pengaturan</h1>
          <p className="text-slate-400 mt-1">Kelola preferensi dan keamanan akun Anda</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifikasi</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="danger">Lanjutan</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardHeader>
                <CardTitle>Notifikasi</CardTitle>
                <CardDescription>Pilih apa yang ingin Anda ketahui</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: "claimUpdates",
                    label: "Update Klaim",
                    description: "Notifikasi ketika ada update status klaim Anda",
                  },
                  {
                    key: "newMessages",
                    label: "Pesan Baru",
                    description: "Notifikasi untuk setiap pesan yang diterima",
                  },
                  {
                    key: "itemMatches",
                    label: "Kecocokan Item",
                    description: "Saat ada item baru yang sesuai dengan pencarian Anda",
                  },
                  {
                    key: "weeklyReport",
                    label: "Laporan Mingguan",
                    description: "Ringkasan aktivitas mingguan Anda",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      checked={notifications[setting.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [setting.key]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Kontrol siapa yang dapat melihat informasi Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: "profilePublic",
                    label: "Profil Publik",
                    description: "Biarkan orang lain melihat profil Anda",
                  },
                  {
                    key: "showStats",
                    label: "Tampilkan Statistik",
                    description: "Tampilkan statistik pencapaian Anda",
                  },
                  {
                    key: "allowMessages",
                    label: "Izinkan Pesan",
                    description: "Biarkan pengguna lain mengirim pesan kepada Anda",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      checked={privacy[setting.key as keyof typeof privacy]}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({
                          ...prev,
                          [setting.key]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone */}
          <TabsContent value="danger" className="space-y-4">
            <Card className="bg-red-950/20 border-red-900/30">
              <CardHeader>
                <CardTitle className="text-red-400">Zona Berbahaya</CardTitle>
                <CardDescription>Tindakan yang tidak dapat dibatalkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logout */}
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout dari Semua Perangkat
                </Button>

                {/* Delete Account */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus Akun
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Akun Permanen</AlertDialogTitle>
                      <AlertDialogDescription>
                        Aksi ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3">
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
