"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatusBadge } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Trash2, Edit2, Eye } from "lucide-react"
import { type User, ItemStatus } from "@/types"

const mockUser: User = {
  id: "1",
  name: "Ahmad Rizki",
  email: "ahmad@ui.ac.id",
  role: "student",
  faculty: "Teknik",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockItems = [
  {
    id: "1",
    title: "iPhone 13 Pro Max",
    status: ItemStatus.LOST,
    category: "Elektronik",
    location: "Perpustakaan Pusat",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 245,
    claims: 3,
  },
  {
    id: "2",
    title: "Dompet Kulit Hitam",
    status: ItemStatus.CLAIMED,
    category: "Tas & Dompet",
    location: "Kantin",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    views: 156,
    claims: 1,
  },
]

export default function MyItemsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredItems = activeTab === "all" ? mockItems : mockItems.filter((item) => item.status === activeTab)

  return (
    <DashboardLayout user={mockUser} notificationCount={3} onLogout={() => {}}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Item Saya</h1>
            <p className="text-slate-400 mt-1">Kelola semua laporan barang Anda</p>
          </div>
          <Link href="/dashboard/feed">
            <Button className="bg-primary hover:bg-primary/90 text-slate-900">Lapor Item Baru</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Laporan", value: mockItems.length },
            { label: "Total Viewers", value: 401 },
            { label: "Total Claims", value: 4 },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Semua ({mockItems.length})</TabsTrigger>
            <TabsTrigger value={ItemStatus.LOST}>Hilang</TabsTrigger>
            <TabsTrigger value={ItemStatus.FOUND}>Ditemukan</TabsTrigger>
            <TabsTrigger value={ItemStatus.CLAIMED}>Diklaim</TabsTrigger>
            <TabsTrigger value={ItemStatus.RESOLVED}>Selesai</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {/* Table */}
            <div className="border border-slate-800/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-900/50 border-b border-slate-800/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-slate-300">Item</TableHead>
                    <TableHead className="text-slate-300">Kategori</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 text-right">Viewers</TableHead>
                    <TableHead className="text-slate-300 text-right">Claims</TableHead>
                    <TableHead className="text-slate-300 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.location}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.views}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.claims}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
