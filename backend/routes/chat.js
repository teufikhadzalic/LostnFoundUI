// Chat route deprecated/disabled — chatbot UI removed by request.
// This file remains to avoid import breakage but returns 410 Gone for any requests.
import express from "express"

const router = express.Router()

router.all("/", (req, res) => {
  res.status(410).json({ error: "Chatbot endpoint has been removed" })
})

export default router
