import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const conversationSchema = new mongoose.Schema({
  // Optionally tie a conversation to a claim (one conversation per claim)
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: "Claim", unique: true, sparse: true },
  // Optionally tie a conversation to a post (one conversation per post)
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", unique: true, sparse: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Conversation", conversationSchema)
