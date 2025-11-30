"use client"

import { useState } from "react"
import type { Claim } from "@/types"
import { formatDate } from "@/lib/utils"
import { UserAvatar } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, FileText, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { Shield } from "lucide-react" // Import Shield component

interface VerificationDetailModalProps {
  claim: Claim & {
    item?: any
    claimant?: any
    poster?: any
  }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onApprove?: (note: string) => void
  onReject?: (reason: string) => void
}

export function VerificationDetailModal({
  claim,
  open = false,
  onOpenChange,
  onApprove,
  onReject,
}: VerificationDetailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [note, setNote] = useState("")

  const handleSubmit = async () => {
    if (!note.trim()) {
      alert("Mohon isi catatan/alasan")
      return
    }
    setIsSubmitting(true)
    try {
      if (action === "approve") {
        onApprove?.(note)
      } else {
        onReject?.(note)
      }
      onOpenChange?.(false)
      setAction(null)
      setNote("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verifikasi Klaim
          </DialogTitle>
          <DialogDescription>Tinjau bukti dan verifikasi keaslian klaim</DialogDescription>
        </DialogHeader>

        {/* Item & Claimant Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {claim.item?.imageUrls?.[0] && (
                <div className="relative h-40 bg-slate-200 rounded-lg overflow-hidden">
                  <Image
                    src={claim.item.imageUrls[0] || "/placeholder.svg"}
                    alt={claim.item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">{claim.item?.title}</p>
                <p className="text-sm text-muted-foreground">{claim.item?.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Laporan Masuk</p>
                <p className="text-sm font-medium">{formatDate(claim.item?.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Claimant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pemohon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserAvatar name={claim.claimant?.name || "Unknown"} avatarUrl={claim.claimant?.avatarUrl} size="lg" />
                <div>
                  <p className="font-semibold text-foreground">{claim.claimant?.name}</p>
                  <p className="text-sm text-muted-foreground">{claim.claimant?.faculty}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">{claim.claimant?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nomor Telepon</p>
                <p className="text-sm font-medium">{claim.claimant?.phone || "Tidak tersedia"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evidence Tabs */}
        <Tabs defaultValue="evidence">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evidence">Bukti (3 Foto)</TabsTrigger>
            <TabsTrigger value="reason">Alasan Klaim</TabsTrigger>
          </TabsList>

          <TabsContent value="evidence" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "Kartu NPM Pemohon", src: claim.evidence?.npmCard },
                { title: "Foto dengan Barang", src: claim.evidence?.photoWithItem },
                {
                  title: "Foto Item Asli",
                  src: claim.item?.imageUrls?.[0],
                },
              ].map((photo, idx) => (
                <div key={idx} className="border border-slate-800/50 rounded-lg overflow-hidden">
                  <div className="relative h-48 bg-slate-200 flex items-center justify-center">
                    {photo.src ? (
                      <Image src={photo.src || "/placeholder.svg"} alt={photo.title} fill className="object-cover" />
                    ) : (
                      <div className="text-muted-foreground text-center text-sm">Tidak ada foto</div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-900/50">
                    <p className="text-xs font-medium text-foreground">{photo.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reason" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Penjelasan Pemohon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{claim.reason}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Verification Action */}
        {action && (
          <Card
            className={action === "approve" ? "border-green-600/30 bg-green-50/5" : "border-red-600/30 bg-red-50/5"}
          >
            <CardHeader>
              <CardTitle className="text-base">{action === "approve" ? "Setujui Klaim" : "Tolak Klaim"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  {action === "approve" ? "Catatan Persetujuan" : "Alasan Penolakan"}
                </label>
                <Textarea
                  placeholder={
                    action === "approve"
                      ? "Tambahkan catatan opsional tentang verifikasi ini..."
                      : "Jelaskan mengapa klaim ini ditolak..."
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <Alert className={action === "approve" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                <AlertCircle className={`h-4 w-4 ${action === "approve" ? "text-green-600" : "text-red-600"}`} />
                <AlertDescription className={action === "approve" ? "text-green-700" : "text-red-700"}>
                  {action === "approve"
                    ? "Pemohon akan dihubungi untuk pengambilan barang."
                    : "Pemohon akan menerima notifikasi penolakan."}
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAction(null)} className="flex-1">
                  Batal
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 ${
                    action === "approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-destructive hover:bg-destructive/90"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : action === "approve" ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Setujui
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Tolak
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {!action && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setAction("reject")} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Tolak Klaim
            </Button>
            <Button onClick={() => setAction("approve")} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <Check className="h-4 w-4 mr-2" />
              Setujui Klaim
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
