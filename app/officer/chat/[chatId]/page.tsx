import ClaimChat from "@/components/officer/claim-chat"

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat Klaim</h1>
      <ClaimChat chatId={chatId} />
    </div>
  )
}
