"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { VerificationCard } from "@/components/officer/VerificationCard"
import { VerificationDetailModal } from "@/components/officer/VerificationDetailModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type User, UserRole, ClaimStatus } from "@/types"
import { TrendingUp, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"

const mockOfficer: User = {
  id: "officer-1",
  name: "Pak Joko (Security)",
  email: "petugas.officer@ui.ac.id",
  role: UserRole.OFFICER,
  faculty: "Security Department",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockClaims = [
  {
    id: "claim-1",
    itemId: "item-1",
    claimerId: "user-1",
    status: ClaimStatus.PENDING,
    reason:
      "Ini adalah iPhone 13 Pro Max saya. Saya membeli di Apple Store pada November 2022. Terdapat sedikit goresan di bagian kamera belakang...",
    evidence: {
      npmCard: "/npm-card.jpg",
      photoWithItem: "/person-using-phone.png",
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(),
    item: {
      id: "item-1",
      title: "iPhone 13 Pro Max Warna Hitam",
      category: "Elektronik",
      location: "Perpustakaan Pusat",
      imageUrls: ["/modern-smartphone.png"],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    claimant: {
      id: "user-1",
      name: "Andi Pratama",
      email: "andi@ui.ac.id",
      faculty: "Fakultas Teknik",
      phone: "081234567890",
      avatarUrl: "",
    },
  },
  {
    id: "claim-2",
    itemId: "item-2",
    claimerId: "user-2",
    status: ClaimStatus.PENDING,
    reason: 'Dompet kulit hitam saya dengan inisial "AP" di bagian sudut kanan...',
    evidence: {
      npmCard: "/generic-identification-card.png",
      photoWithItem: "/person-with-wallet.jpg",
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(),
    item: {
      id: "item-2",
      title: "Dompet Kulit Hitam Branded",
      category: "Tas & Dompet",
      location: "Kantin",
      imageUrls: ["/leather-wallet-contents.png"],
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
    claimant: {
      id: "user-2",
      name: "Siti Nurhaliza",
      email: "siti@ui.ac.id",
      faculty: "Fakultas Hukum",
      phone: "081298765432",
      avatarUrl: "",
    },
  },
]

export default function VerificationPage() {
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [claims, setClaims] = useState(mockClaims)

  const handleVerify = (claimId: string, approved: boolean) => {
    setSelectedClaim(claims.find((c) => c.id === claimId) || null)
    if (!selectedClaim) {
      setSelectedClaim(claims.find((c) => c.id === claimId))
    }
  }

  const handleApprove = (note: string) => {
    console.log("Approved claim:", selectedClaim?.id, "Note:", note)
    setClaims((prev) => prev.map((c) => (c.id === selectedClaim.id ? { ...c, status: ClaimStatus.APPROVED } : c)))
    setSelectedClaim(null)
  }

  const handleReject = (reason: string) => {
    console.log("Rejected claim:", selectedClaim?.id, "Reason:", reason)
    setClaims((prev) => prev.map((c) => (c.id === selectedClaim.id ? { ...c, status: ClaimStatus.REJECTED } : c)))
    setSelectedClaim(null)
  }

  const stats = [
    {
      label: "Total Klaim",
      value: claims.length,
      icon: TrendingUp,
    },
    {
      label: "Menunggu Verifikasi",
      value: claims.filter((c) => c.status === ClaimStatus.PENDING).length,
      icon: Clock,
    },
    {
      label: "Disetujui",
      value: claims.filter((c) => c.status === ClaimStatus.APPROVED).length,
      icon: CheckCircle,
    },
    {
      label: "Ditolak",
      value: claims.filter((c) => c.status === ClaimStatus.REJECTED).length,
      icon: XCircle,
    },
  ]

  return (
    <DashboardLayout user={mockOfficer} notificationCount={2} onLogout={() => {}}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Verifikasi Klaim</h1>
          <p className="text-slate-400 mt-1">Tinjau dan verifikasi klaim barang yang masuk</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="bg-slate-900/50 border-slate-800/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-primary/30" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="pending">
                Menunggu ({claims.filter((c) => c.status === ClaimStatus.PENDING).length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Disetujui ({claims.filter((c) => c.status === ClaimStatus.APPROVED).length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Ditolak ({claims.filter((c) => c.status === ClaimStatus.REJECTED).length})
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Muat Ulang
            </Button>
          </div>

          <TabsContent value="pending" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claims
                .filter((c) => c.status === ClaimStatus.PENDING)
                .map((claim) => (
                  <div key={claim.id} onClick={() => setSelectedClaim(claim)} className="cursor-pointer">
                    <VerificationCard claim={claim} onVerify={handleVerify} />
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claims
                .filter((c) => c.status === ClaimStatus.APPROVED)
                .map((claim) => (
                  <VerificationCard key={claim.id} claim={claim} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claims
                .filter((c) => c.status === ClaimStatus.REJECTED)
                .map((claim) => (
                  <VerificationCard key={claim.id} claim={claim} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      {selectedClaim && (
        <VerificationDetailModal
          claim={selectedClaim}
          open={!!selectedClaim}
          onOpenChange={(open) => !open && setSelectedClaim(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </DashboardLayout>
  )
}
