import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import mongoose from "mongoose"

// Load environment variables before importing modules that may read them.
dotenv.config({ path: "./backend/.env" })

import logger from "./backend/utils/logger.js"

// Dynamically import route modules after dotenv.config so they see populated process.env
const authRoutes = (await import("./backend/routes/auth.js")).default
const postRoutes = (await import("./backend/routes/posts.js")).default
const claimRoutes = (await import("./backend/routes/claims.js")).default
const commentRoutes = (await import("./backend/routes/comments.js")).default
const userRoutes = (await import("./backend/routes/users.js")).default
const officerRoutes = (await import("./backend/routes/officer.js")).default
const notificationRoutes = (await import("./backend/routes/notifications.js")).default
const matchRoutes = (await import("./backend/routes/match.js")).default
const chatRoutes = (await import("./backend/routes/chats.js")).default

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection — await connection before starting server
mongoose.set("strictQuery", false)

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { connectTimeoutMS: 30000 })
    logger.info("MongoDB connected successfully")

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (err) {
    logger.error("MongoDB connection error:", err)
    process.exit(1)
  }
}

start()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/claims", claimRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/users", userRoutes)
app.use("/api/officer", officerRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/match", matchRoutes)
app.use("/api/chats", chatRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error in ${req.method} ${req.path} — ${err.message}`)
  res.status(err.status || 500).json({ error: err.message })
})
