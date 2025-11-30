import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./backend/routes/auth.js"
import postRoutes from "./backend/routes/posts.js"
import claimRoutes from "./backend/routes/claims.js"
import commentRoutes from "./backend/routes/comments.js"
import userRoutes from "./backend/routes/users.js"
import officerRoutes from "./backend/routes/officer.js"
import notificationRoutes from "./backend/routes/notifications.js"
import logger from "./backend/utils/logger.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => logger.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/claims", claimRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/users", userRoutes)
app.use("/api/officer", officerRoutes)
app.use("/api/notifications", notificationRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error in ${req.method} ${req.path} — ${err.message}`)
  res.status(err.status || 500).json({ error: err.message })
})

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
