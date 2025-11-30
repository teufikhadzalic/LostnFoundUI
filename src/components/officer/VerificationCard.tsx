"use client"
import type { Claim } from "@/types"
import { formatDistanceToNow } from "@/lib/utils"
import { UserAvatar, StatusBadge } from "@/components/shared"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Image from "next/image"

interface VerificationCardProps {
  claim: Claim & {
    item?: any
    claimant?: any
  }
  onVerify?: (claimId: string, approved: boolean) => void
}

export function VerificationCard({ claim, onVerify }: VerificationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-smooth border-slate-800/50">
      {/* Image Gallery */}
      <div className="grid grid-cols-3 gap-1 h-40 bg-slate-900">
        {[claim.evidence?.npmCard, claim.evidence?.photoWithItem, claim.item?.imageUrls?.[0]].map((img, idx) => (
          <div key={idx} className="relative bg-slate-800 flex items-center justify-center overflow-hidden group">
            {img ? (
              <Image
                src={img || "/placeholder.svg"}
                alt={`Evidence ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-2">
                {idx === 0 ? "NPM Card" : idx === 1 ? "Photo w/ Item" : "Item Photo"}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="space-y-3">
          {/* Item Title & Status */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground line-clamp-1">{claim.item?.title}</h3>
              <p className="text-sm text-muted-foreground">
                {claim.item?.category} • {claim.item?.location}
              </p>
            </div>
            <StatusBadge status={claim.status} />
          </div>

          {/* Claimant Info */}
          <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded">
            <UserAvatar name={claim.claimant?.name || "Unknown"} avatarUrl={claim.claimant?.avatarUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{claim.claimant?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{claim.claimant?.faculty}</p>
            </div>
            <Badge variant="outline" className="flex-shrink-0">
              {formatDistanceToNow(claim.createdAt)}
            </Badge>
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Alasan Klaim
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">{claim.reason}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onVerify?.(claim.id, false)} className="flex-1">
            Tolak
          </Button>
          <Button
            size="sm"
            onClick={() => onVerify?.(claim.id, true)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Setujui
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
