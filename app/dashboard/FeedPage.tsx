"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { FeedContainer } from "@/components/feed/FeedContainer"
import { CreateItemModal } from "@/components/feed/CreateItemModal"
import type { User } from "@/types"

// Mock user for demo
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

export default function FeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateItem = (data: any) => {
    console.log("Creating item:", data)
    setIsCreateModalOpen(false)
  }

  return (
    <DashboardLayout user={mockUser} notificationCount={3} onLogout={() => {}}>
      <FeedContainer onCreateNew={() => setIsCreateModalOpen(true)} />
      <CreateItemModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSubmit={handleCreateItem} />
    </DashboardLayout>
  )
}
