"use client"

import { useState } from "react"
import type { User } from "@/types"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { UserAvatar } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Phone } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"


const mockUser: User = {
  id: "1",
  name: "teufik ali ",
  email: "topik@ui.ac.id",
  role: "student" as any,  // temporary: cast to bypass enum check
  faculty: "Teknik",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockConversations = [
  {
    id: "1",
    participantId: "user-2",
    participantName: "Siti Nurhaliza",
    participantAvatar: "",
    lastMessage: "Terima kasih untuk mengembalikan dompet saya!",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: false,
    messages: [
      {
        id: "m1",
        sender: "user-2",
        content: "Apakah kamu yang menemukan dompet saya?",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: "m2",
        sender: mockUser.id,
        content: "Ya, saya menemukannya di kantin. Apakah itu punya kamu?",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: "m3",
        sender: "user-2",
        content: "Terima kasih untuk mengembalikan dompet saya!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "2",
    participantId: "user-3",
    participantName: "Andi Pratama",
    participantAvatar: "",
    lastMessage: "Klaim sudah disetujui oleh petugas",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unread: true,
    messages: [
      {
        id: "m4",
        sender: "user-3",
        content: "Halo, bagaimana status iPhone saya?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "m5",
        sender: "user-3",
        content: "Klaim sudah disetujui oleh petugas",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    console.log("Sending message:", messageInput)
    setMessageInput("")
  }

  return (
    <DashboardLayout user={mockUser} notificationCount={1} onLogout={() => {}}>
      <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6">
        {/* Conversations List */}
        <div className="w-full lg:w-80 flex flex-col">
          <div className="space-y-4 mb-4">
            <h1 className="text-2xl font-bold text-white">Pesan</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari percakapan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-4">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConversation.id === conv.id
                      ? "bg-primary/20 border border-primary/30"
                      : "hover:bg-slate-800/30 border border-transparent"
                  }`}
                >
                  <div className="flex gap-3">
                    <UserAvatar name={conv.participantName} avatarUrl={conv.participantAvatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">{conv.participantName}</p>
                        {conv.unread && <Badge className="bg-primary">Baru</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(conv.lastMessageTime)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedConversation && (
          <div className="flex-1 flex flex-col bg-slate-900/30 border border-slate-800/50 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={selectedConversation.participantName}
                  avatarUrl={selectedConversation.participantAvatar}
                  size="md"
                />
                <div>
                  <p className="font-semibold text-foreground">{selectedConversation.participantName}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((msg) => {
                  const isOwn = msg.sender === mockUser.id
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isOwn ? "justify-end" : ""}`}>
                      {!isOwn && (
                        <UserAvatar
                          name={selectedConversation.participantName}
                          avatarUrl={selectedConversation.participantAvatar}
                          size="sm"
                        />
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn ? "bg-primary text-slate-900" : "bg-slate-800 text-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? "text-slate-700" : "text-muted-foreground"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-800/50 flex gap-2">
              <Input
                placeholder="Ketik pesan..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage()
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                size="icon"
                className="bg-primary hover:bg-primary/90 text-slate-900"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
