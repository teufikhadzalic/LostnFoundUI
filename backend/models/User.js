import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const { Schema } = mongoose

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  npm: { type: String, unique: true, sparse: true }, // Student ID
  faculty: {
    type: String,
    enum: [
      "Ilmu Komputer",
      "Kedokteran Gigi",
      "Ilmu Administrasi",
      "Kesehatan Masyarakat",
      "Psikologi",
      "Ilmu Keperawatan",
      "Kedokteran",
      "Ekonomi dan Bisnis",
      "Hukum",
      "Ilmu Sosial dan Ilmu Politik",
      "Ilmu Pengetahuan Budaya",
      "Matematika dan Ilmu Pengetahuan Alam",
      "Teknik",
      "Farmasi",
    ],
  },
  role: { type: String, enum: ["student", "officer"], default: "student" },
  profileImage: { type: String },
  username: {
    type: String,
    unique: true,
    sparse: true, // allow multiple docs without username (null)
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.password.startsWith("$2")) {
    // Only hash if it doesn't look like a bcrypt hash already
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.model("User", userSchema)
