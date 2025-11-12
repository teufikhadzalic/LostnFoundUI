import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Post from "../models/Post.js"
import logger from "../utils/logger.js"

const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemName, description, category, faculty, location, image, type } = req.body

    if (!itemName || !description || !category || !faculty || !location || !image || !type) {
      logger.warn("POST /api/posts — missing required fields")
      return res.status(400).json({ error: "Missing required fields" })
    }

    const post = new Post({
      userId: req.user.userId,
      itemName,
      description,
      category,
      faculty,
      location,
      image,
      type,
    })

    await post.save()
    logger.info(`Post created successfully: ${post._id}`)
    res.status(201).json(post)
  } catch (err) {
    logger.error(`Error in POST /api/posts — ${err.message}`)
    res.status(500).json({ error: "Failed to create post" })
  }
})

router.get("/", async (req, res) => {
  try {
    const { faculty, category, search, type } = req.query
    const filter = { status: "active" }

    if (faculty) filter.faculty = faculty
    if (category) filter.category = category
    if (type) filter.type = type
    if (search)
      filter.$or = [{ itemName: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]

    const posts = await Post.find(filter).populate("userId", "name profileImage").sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    logger.error(`Error in GET /api/posts — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch posts" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "name email profileImage npm faculty")
    if (!post) {
      logger.warn(`GET /api/posts/:id — post not found: ${req.params.id}`)
      return res.status(404).json({ error: "Post not found" })
    }
    res.json(post)
  } catch (err) {
    logger.error(`Error in GET /api/posts/:id — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch post" })
  }
})

export default router
