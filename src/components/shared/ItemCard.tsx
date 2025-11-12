"use client"
import Link from "next/link"
import type { Item } from "@/types"
import { formatDistanceToNow, truncateText } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserAvatar } from "./UserAvatar"
import { StatusBadge } from "./StatusBadge"
import { Heart, MessageCircle, MapPin, Clock } from "lucide-react"
import Image from "next/image"

interface ItemCardProps {
  item: Item & { user?: { name: string; avatarUrl?: string } }
  onLike?: () => void
  liked?: boolean
}

export function ItemCard({ item, onLike, liked = false }: ItemCardProps) {
  return (
    <Link href={`/dashboard/items/${item.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-smooth cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 bg-slate-200 overflow-hidden group">
          {item.imageUrls[0] && (
            <Image
              src={item.imageUrls[0] || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-3 right-3">
            <StatusBadge status={item.status} />
          </div>
        </div>

        {/* Content */}
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground line-clamp-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{truncateText(item.description, 80)}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Meta Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(item.createdAt)}</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <UserAvatar name={item.user?.name || "Unknown"} avatarUrl={item.user?.avatarUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.user?.name || "Anonymous"}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onLike?.()
                }}
                className={`flex items-center gap-1 hover:text-primary transition-colors ${
                  liked ? "text-primary" : ""
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                <span>12</span>
              </button>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{item.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
