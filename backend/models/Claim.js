import mongoose from "mongoose"

const claimSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  evidencePhoto: { type: String }, // Optional/Deprecated: Photo of item/proof
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verificationNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Claim", claimSchema)
