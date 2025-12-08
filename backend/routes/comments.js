import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Comment from "../models/Comment.js"
import Notification from "../models/Notification.js"
import Post from "../models/Post.js"
import Claim from "../models/Claim.js"
import logger from "../utils/logger.js"

const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId, text } = req.body

    if (!postId || !text) {
      logger.warn("POST /api/comments — missing required fields")
      return res.status(400).json({ error: "Missing required fields" })
    }

    const comment = new Comment({
      postId,
      userId: req.user.userId,
      text,
    })

    await comment.save()

    // Notify post owner
    const post = await Post.findById(postId)
    if (post && post.userId.toString() !== req.user.userId) {
      await Notification.create({
        userId: post.userId,
        type: "new_comment",
        message: "Komentar baru di postingan Anda",
        postId,
      })
    }

    // Check for approved claim and notify the claimer
    const approvedClaim = await Claim.findOne({ postId, status: "approved" })
    if (approvedClaim && approvedClaim.userId.toString() !== req.user.userId) {
      // Don't notify if the claimer is the one commenting
      await Notification.create({
        userId: approvedClaim.userId,
        type: "new_comment",
        message: "Komentar baru di klaim yang disetujui",
        postId,
      })
    }

    logger.info(`Comment created: ${comment._id}`)
    res.status(201).json(comment)
  } catch (err) {
    logger.error(`Error in POST /api/comments — ${err.message}`)
    res.status(500).json({ error: "Failed to create comment" })
  }
})

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
    res.json(comments)
  } catch (err) {
    logger.error(`Error in GET /api/comments/:postId — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch comments" })
  }
})

router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment || comment.userId.toString() !== req.user.userId) {
      logger.warn(`DELETE /api/comments/:commentId — unauthorized access`)
      return res.status(403).json({ error: "Unauthorized" })
    }

    await Comment.findByIdAndDelete(req.params.commentId)
    logger.info(`Comment deleted: ${req.params.commentId}`)
    res.json({ message: "Comment deleted" })
  } catch (err) {
    logger.error(`Error in DELETE /api/comments/:commentId — ${err.message}`)
    res.status(500).json({ error: "Failed to delete comment" })
  }
})

export default router
