import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["claim_approved", "claim_rejected", "new_comment", "post_claimed"], required: true },
  message: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: "Claim" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Notification", notificationSchema)
