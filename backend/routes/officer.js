import express from "express"
import { authMiddleware, officerMiddleware } from "../middleware/auth.js"
import Claim from "../models/Claim.js"
import Post from "../models/Post.js"
import Notification from "../models/Notification.js"
import logger from "../utils/logger.js"

const router = express.Router()

router.get("/pending-claims", authMiddleware, officerMiddleware, async (req, res) => {
  try {
    const claims = await Claim.find({ status: "pending" })
      .populate("userId", "name npm profileImage")
      .populate("postId", "itemName image")
      .sort({ createdAt: -1 })
    res.json(claims)
  } catch (err) {
    logger.error(`Error in GET /api/officer/pending-claims — ${err.message}`)
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
    await Notification.create({
      userId: claim.userId._id,
      type: status === "approved" ? "claim_approved" : "claim_rejected",
      message: `Your claim has been ${status}`,
      claimId: claim._id,
    })

    logger.info(`Claim ${status}: ${req.params.claimId} by officer ${req.user.userId}`)
    res.json(claim)
  } catch (err) {
    logger.error(`Error in PATCH /api/officer/:claimId/verify — ${err.message}`)
    res.status(500).json({ error: "Failed to verify claim" })
  }
})

export default router
