import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDistanceToNow(date: Date | string) {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return "Baru saja"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m yang lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h yang lalu`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d yang lalu`

  return formatDate(date)
}

export function truncateText(text: string, maxLength = 100) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
