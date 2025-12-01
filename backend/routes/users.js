import express from "express"
import User from "../models/User.js"
import Post from "../models/Post.js"
import logger from "../utils/logger.js"
import { verifyToken } from "../utils/createToken.js"

const router = express.Router()

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password")
    if (!user) {
      logger.warn(`GET /api/users/:userId — user not found: ${req.params.userId}`)
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (err) {
    logger.error(`Error in GET /api/users/:userId — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

router.get("/:userId/posts", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
    res.json(posts)
  } catch (err) {
    logger.error(`Error in GET /api/users/:userId/posts — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch user posts" })
  }
})

// Update user profile — supports cookie or Authorization header for token
router.patch("/:userId", async (req, res) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1])
    const payload = verifyToken(token)
    if (!payload || !payload.userId) return res.status(401).json({ error: "Unauthorized" })

    // Only the user themselves or an officer can update the profile
    if (String(payload.userId) !== String(req.params.userId) && payload.role !== "officer") {
      return res.status(403).json({ error: "Forbidden" })
    }

  const allowed = ["name", "email", "faculty", "npm", "username", "profileImage", "notificationEmail"]
    const updates = {}
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k]
    }
    updates.updatedAt = Date.now()

    const user = await User.findByIdAndUpdate(req.params.userId, { $set: updates }, { new: true }).select("-password")
    if (!user) return res.status(404).json({ error: "User not found" })

    return res.json(user)
  } catch (err) {
    logger.error(`Error in PATCH /api/users/:userId — ${err.message}`)
    return res.status(500).json({ error: "Failed to update user" })
  }
})

export default router
