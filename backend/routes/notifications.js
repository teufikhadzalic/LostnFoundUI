import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Notification from "../models/Notification.js"
import logger from "../utils/logger.js"

const router = express.Router()

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(50)
    res.json(notifications)
  } catch (err) {
    logger.error(`Error in GET /api/notifications — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch notifications" })
  }
})

router.patch("/:notificationId/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true })
    res.json(notification)
  } catch (err) {
    logger.error(`Error in PATCH /api/notifications/:notificationId/read — ${err.message}`)
    res.status(500).json({ error: "Failed to update notification" })
  }
})

export default router
