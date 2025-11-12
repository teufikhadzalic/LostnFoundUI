import express from "express"
import User from "../models/User.js"
import Post from "../models/Post.js"
import logger from "../utils/logger.js"

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

export default router
