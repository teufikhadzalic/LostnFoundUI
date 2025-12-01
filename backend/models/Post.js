import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Elektronik", "Dokumen", "Tas & Dompet", "Kunci", "Pakaian", "Alat Tulis", "Lainnya"],
    required: true,
  },
  faculty: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, enum: ["lost", "found"], required: true },
  status: { type: String, enum: ["active", "claimed", "resolved"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Optional cached semantic embedding to speed up matching and reduce external calls
  embedding: { type: [Number], default: undefined },
})

export default mongoose.model("Post", postSchema)
