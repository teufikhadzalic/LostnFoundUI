import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Claim from "../models/Claim.js"
import Post from "../models/Post.js"
import Notification from "../models/Notification.js"
import logger from "../utils/logger.js"

const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId, reason } = req.body

    if (!postId || !reason) {
      logger.warn("POST /api/claims — missing required fields")
      return res.status(400).json({ error: "Missing required fields" })
    }

    const post = await Post.findById(postId)
    if (!post) {
      logger.warn(`POST /api/claims — post not found: ${postId}`)
      return res.status(404).json({ error: "Post not found" })
    }

    const claim = new Claim({
      postId,
      userId: req.user.userId,
      reason,
    })

    await claim.save()
    await Post.findByIdAndUpdate(postId, { status: "claimed" })

    // Notify post owner
    await Notification.create({
      userId: post.userId,
      type: "post_claimed",
      message: `Someone claimed your post: ${post.itemName}`,
      postId,
      claimId: claim._id,
    })

    logger.info(`Claim created: ${claim._id} for post ${postId}`)
    res.status(201).json(claim)
  } catch (err) {
    logger.error(`Error in POST /api/claims — ${err.message}`)
    res.status(500).json({ error: "Failed to create claim" })
  }
})

router.get("/:postId", async (req, res) => {
  try {
    const claims = await Claim.find({ postId: req.params.postId }).populate("userId", "name npm")
    res.json(claims)
  } catch (err) {
    logger.error(`Error in GET /api/claims/:postId — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch claims" })
  }
})

// GET claim by id (detail) — returns claim with populated post info
router.get("/detail/:claimId", async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId).populate({ path: "postId", select: "itemName description category faculty location image type status createdAt userId" })
    if (!claim) {
      logger.warn(`GET /api/claims/detail/:claimId — claim not found: ${req.params.claimId}`)
      return res.status(404).json({ error: "Claim not found" })
    }
    res.json(claim)
  } catch (err) {
    logger.error(`Error in GET /api/claims/detail/:claimId — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch claim detail" })
  }
})

export default router
