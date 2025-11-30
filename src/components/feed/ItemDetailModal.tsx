"use client"

import { useState } from "react"
import type { Item } from "@/types"
import { formatDistanceToNow, formatDate } from "@/lib/utils"
import { UserAvatar, StatusBadge } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Clock, User, MessageSquare, Heart, Share2, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"

interface ItemDetailModalProps {
  item: Item & { user?: any }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClaim?: (reason: string) => void
  onLike?: () => void
  isCurrentUser?: boolean
}

export function ItemDetailModal({
  item,
  open = false,
  onOpenChange,
  onClaim,
  onLike,
  isCurrentUser = false,
}: ItemDetailModalProps) {
  const [claimReason, setClaimReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [isLiked, setIsLiked] = useState(item.liked || false)
  const [likeCount, setLikeCount] = useState(item.likes || 0)

  const handleClaimSubmit = async () => {
    if (!claimReason.trim()) {
      alert("Mohon isi alasan klaim")
      return
    }
    setIsSubmitting(true)
    try {
      onClaim?.(claimReason)
      setClaimed(true)
      setClaimReason("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    onLike?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
          <DialogDescription>{formatDistanceToNow(item.createdAt)}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <div className="lg:col-span-1 space-y-4">
            {item.imageUrls && item.imageUrls.length > 0 ? (
              <>
                <div className="relative h-64 bg-slate-200 rounded-lg overflow-hidden">
                  <Image src={item.imageUrls[0] || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                {item.imageUrls.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {item.imageUrls.slice(1, 4).map((img, idx) => (
                      <div key={idx} className="relative h-16 bg-slate-200 rounded-lg overflow-hidden">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${item.title} ${idx + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                Tidak ada foto
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status & Tags */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <StatusBadge status={item.status as any} />
                {item.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              {!isCurrentUser && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLike}
                    className={isLiked ? "text-primary border-primary" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Lokasi</p>
                      <p className="font-semibold text-foreground">{item.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dilaporkan</p>
                      <p className="font-semibold text-foreground">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Pelapor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={item.user?.name || "Unknown"} avatarUrl={item.user?.avatarUrl} />
                    <div>
                      <p className="font-semibold text-foreground">{item.user?.name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">{item.user?.faculty}</p>
                    </div>
                  </div>
                  {!isCurrentUser && (
                    <Button size="sm" variant="outline">
                      Hubungi
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Claim Section - Item must be lost/found, not pending or resolved */}
            {!isCurrentUser && (item.status === "lost" || item.status === "found") && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Klaim Barang</CardTitle>
                  <CardDescription>Jelaskan mengapa Anda yakin ini adalah barang Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {claimed ? (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Klaim Anda telah dikirim! Petugas akan memverifikasi dalam 24-48 jam.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <Textarea
                        placeholder="Jelaskan ciri khas, kondisi, atau detail lain yang membuktikan Anda pemilik asli..."
                        value={claimReason}
                        onChange={(e) => setClaimReason(e.target.value)}
                        rows={4}
                      />
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-700">
                          Klaim Anda akan diverifikasi oleh petugas keamanan. Sediakan informasi sebanyak mungkin untuk
                          memastikan barang Anda.
                        </p>
                      </div>
                      <Button
                        onClick={handleClaimSubmit}
                        disabled={isSubmitting || !claimReason.trim()}
                        className="w-full bg-primary hover:bg-primary/90 text-slate-900"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          "Klaim Barang"
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <Tabs defaultValue="comments" className="mt-6">
          <TabsList>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Komentar ({item.comments?.length || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="comments" className="space-y-4">
            {item.comments && item.comments.length > 0 ? (
              <div className="space-y-4">
                {item.comments.map((comment: any) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{comment.user?.name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(comment.createdAt)}</p>
                        </div>
                        <p className="text-muted-foreground">{comment.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Belum ada komentar. Jadilah yang pertama!</div>
            )}

            {/* Add Comment */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Textarea placeholder="Tambahkan komentar atau pertanyaan..." rows={3} />
              <Button className="w-full bg-primary hover:bg-primary/90 text-slate-900">Posting Komentar</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
