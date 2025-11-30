import mongoose from "mongoose"

const claimSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  ownerPhoto: { type: String, required: true }, // Photo of owner with item
  npmPhoto: { type: String, required: true }, // Student ID photo
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verificationNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Claim", claimSchema)
