"use client"

import type React from "react"
import { AlertCircle, Package, MessageCircle } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: "items" | "comments" | "general"
  action?: React.ReactNode
}

const iconMap = {
  items: Package,
  comments: MessageCircle,
  general: AlertCircle,
}

export function EmptyState({ title, description, icon = "general", action }: EmptyStateProps) {
  const Icon = iconMap[icon]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
