"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  avatarUrl?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

export function UserAvatar({ name, avatarUrl, size = "md", className }: UserAvatarProps) {
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {avatarUrl && <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />}
      <AvatarFallback className="bg-primary text-slate-900 font-semibold">{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
