import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Added `match_found` to support automated matching notifications when a lost/found post matches
  type: {
    type: String,
    enum: ["claim_approved", "claim_rejected", "new_comment", "post_claimed", "match_found", "claim_chat"],
    required: true,
  },
  message: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: "Claim" },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  // Optional link that frontend can use to navigate directly to the chat
  link: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Notification", notificationSchema)
