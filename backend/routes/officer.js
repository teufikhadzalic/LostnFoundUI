import express from "express"
import { authMiddleware, officerMiddleware } from "../middleware/auth.js"
import Claim from "../models/Claim.js"
import Post from "../models/Post.js"
import Notification from "../models/Notification.js"
import Conversation from "../models/Conversation.js"
import logger from "../utils/logger.js"

const router = express.Router()

router.get("/pending-claims", authMiddleware, officerMiddleware, async (req, res) => {
  try {
    let claims = await Claim.find({ status: "pending" })
      .populate("userId", "name npm profileImage")
      .populate("postId", "itemName image")
      .sort({ createdAt: -1 })

    // Remove claims that reference a deleted post (postId === null)
    claims = claims.filter((c) => c.postId)

    res.json(claims)
  } catch (err) {
    logger.error(`Error in GET /api/officer/pending-claims — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch claims" })
  }
})

// Return all claims (for officer dashboard)
router.get("/claims", authMiddleware, officerMiddleware, async (req, res) => {
  try {
    let claims = await Claim.find()
      .populate("userId", "name npm profileImage")
      .populate("postId", "itemName image status")
      .sort({ createdAt: -1 })

    // Remove claims that reference a deleted post (postId === null)
    claims = claims.filter((c) => c.postId)

    res.json(claims)
  } catch (err) {
    logger.error(`Error in GET /api/officer/claims — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch claims" })
  }
})

router.patch("/:claimId/verify", authMiddleware, officerMiddleware, async (req, res) => {
  try {
    const { status, verificationNote } = req.body

    if (!status || !["approved", "rejected"].includes(status)) {
      logger.warn("PATCH /api/officer/:claimId/verify — invalid status")
      return res.status(400).json({ error: "Invalid status" })
    }

    const claim = await Claim.findByIdAndUpdate(
      req.params.claimId,
      { status, verifiedBy: req.user.userId, verificationNote },
      { new: true },
    ).populate("userId")

    if (!claim) {
      logger.warn(`PATCH /api/officer/:claimId/verify — claim not found: ${req.params.claimId}`)
      return res.status(404).json({ error: "Claim not found" })
    }

    // Update post status if approved
    if (status === "approved") {
      await Post.findByIdAndUpdate(claim.postId, { status: "resolved" })
    }

    // Notify claim user
    const notifType = status === "approved" ? "claim_approved" : "claim_rejected"
    await Notification.create({
      userId: claim.userId._id,
      type: notifType,
      message: `Your claim has been ${status}`,
      claimId: claim._id,
    })

    // If approved, ensure a conversation exists and notify with chat link
    if (status === "approved") {
      try {
        let chat = await Conversation.findOne({ claimId: claim._id })
        if (!chat) {
          chat = await Conversation.create({ claimId: claim._id, participants: [claim.userId._id, req.user.userId], messages: [] })
        }

        await Notification.create({
          userId: claim.userId._id,
          type: "claim_chat",
          message: "A chat has been created for your claim. Click to open.",
          claimId: claim._id,
          chatId: chat._id,
          link: `/officer/chat/${chat._id}`,
        })
      } catch (e) {
        logger.error(`Failed to create conversation for claim ${claim._id} — ${e.message}`)
      }
    }

    logger.info(`Claim ${status}: ${req.params.claimId} by officer ${req.user.userId}`)
    res.json(claim)
  } catch (err) {
    logger.error(`Error in PATCH /api/officer/:claimId/verify — ${err.message}`)
    res.status(500).json({ error: "Failed to verify claim" })
  }
})

export default router
