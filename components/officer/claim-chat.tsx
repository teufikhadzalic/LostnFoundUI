"use client"

import { useEffect, useRef, useState } from "react"

interface Message {
  _id?: string
  senderId: { _id?: string; name?: string } | string
  text: string
  createdAt?: string
}

export default function ClaimChat({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const pollRef = useRef<number | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const fetchMessages = async () => {
    if (!chatId) return
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) return
      const data = await res.json()
      setMessages(data.messages || [])
      // scroll
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchMessages()
    pollRef.current = window.setInterval(fetchMessages, 2000)
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId])

  const sendMessage = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      })
      if (res.ok) {
        setText("")
        await fetchMessages()
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-4">
      <div className="h-64 overflow-y-auto mb-3 border border-gray-100 rounded p-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No messages yet</div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="mb-3">
              <div className="text-xs text-gray-500">{typeof m.senderId === "string" ? "User" : m.senderId.name || "User"} • {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</div>
              <div className="mt-1 bg-gray-50 p-2 rounded">{m.text}</div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={sendMessage} disabled={loading} className="px-4 py-2 bg-yellow-400 rounded">
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  )
}
