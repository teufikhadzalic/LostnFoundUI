"use client"
import { Badge } from "@/components/ui/badge"
import type { ItemStatus, ClaimStatus } from "@/types"

interface StatusBadgeProps {
  status: ItemStatus | ClaimStatus
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const statusConfig = {
  lost: { label: "Hilang", variant: "destructive" as const },
  found: { label: "Ditemukan", variant: "default" as const },
  claimed: { label: "Diklaim", variant: "secondary" as const },
  resolved: { label: "Selesai", variant: "outline" as const },
  pending: { label: "Menunggu", variant: "secondary" as const },
  approved: { label: "Disetujui", variant: "default" as const },
  rejected: { label: "Ditolak", variant: "destructive" as const },
  expired: { label: "Kadaluarsa", variant: "outline" as const },
}

export function StatusBadge({ status, variant: overrideVariant }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null

  return <Badge variant={overrideVariant || config.variant}>{config.label}</Badge>
}
