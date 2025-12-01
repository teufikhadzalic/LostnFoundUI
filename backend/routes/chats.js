import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Conversation from "../models/Conversation.js"
import Claim from "../models/Claim.js"
import Post from "../models/Post.js"
import logger from "../utils/logger.js"

const router = express.Router()

// Get or create conversation for a claim
router.get("/claim/:claimId", authMiddleware, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId).populate("userId")
    if (!claim) {
      logger.warn(`GET /api/chats/claim/:claimId — claim not found: ${req.params.claimId}`)
      return res.status(404).json({ error: "Claim not found" })
    }

    let convo = await Conversation.findOne({ claimId: claim._id }).populate("participants", "name")
    if (!convo) {
      convo = await Conversation.create({ claimId: claim._id, participants: [claim.userId._id, req.user.userId], messages: [] })
    }

    res.json(convo)
  } catch (err) {
    logger.error(`Error in GET /api/chats/claim/:claimId — ${err.message}`)
    res.status(500).json({ error: "Failed to get/create conversation" })
  }
})

// Get messages for a conversation
router.get("/:chatId/messages", authMiddleware, async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.chatId).populate("messages.senderId", "name")
    if (!convo) return res.status(404).json({ error: "Conversation not found" })

    const participantIds = convo.participants.map((p) => p.toString())
    if (!participantIds.includes(req.user.userId) && req.user.role !== "officer") {
      return res.status(403).json({ error: "Forbidden" })
    }

    res.json({ messages: convo.messages })
  } catch (err) {
    logger.error(`Error in GET /api/chats/:chatId/messages — ${err.message}`)
    res.status(500).json({ error: "Failed to fetch messages" })
  }
})

// Post a message to a conversation
router.post("/:chatId/messages", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body
    if (!text || typeof text !== "string") return res.status(400).json({ error: "Invalid message" })

    const convo = await Conversation.findById(req.params.chatId)
    if (!convo) return res.status(404).json({ error: "Conversation not found" })

    const participantIds = convo.participants.map((p) => p.toString())
    if (!participantIds.includes(req.user.userId) && req.user.role !== "officer") {
      return res.status(403).json({ error: "Forbidden" })
    }

    const msg = { senderId: req.user.userId, text }
    convo.messages.push(msg)
    convo.updatedAt = new Date()
    await convo.save()

    res.status(201).json({ message: msg })
  } catch (err) {
    logger.error(`Error in POST /api/chats/:chatId/messages — ${err.message}`)
    res.status(500).json({ error: "Failed to post message" })
  }
})

// Optional: create a conversation manually
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { claimId, postId, participants } = req.body

    if (!claimId && !postId) return res.status(400).json({ error: "claimId or postId required" })

    let query = {}
    if (claimId) query.claimId = claimId
    if (postId) query.postId = postId

    let convo = await Conversation.findOne(query)
    if (convo) return res.json(convo)

    const createData = { participants: participants || [req.user.userId], messages: [] }
    if (claimId) createData.claimId = claimId
    if (postId) createData.postId = postId

    convo = await Conversation.create(createData)
    res.status(201).json(convo)
  } catch (err) {
    logger.error(`Error in POST /api/chats — ${err.message}`)
    res.status(500).json({ error: "Failed to create conversation" })
  }
})

// Get or create conversation for a post (single thread per post). Optional query param `claimer` to include a claimant in participants
router.get("/post/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate("userId")
    if (!post) {
      logger.warn(`GET /api/chats/post/:postId — post not found: ${req.params.postId}`)
      return res.status(404).json({ error: "Post not found" })
    }

    let convo = await Conversation.findOne({ postId: post._id }).populate("participants", "name")
    if (!convo) {
      const participants = [post.userId?._id?.toString(), req.user.userId].filter(Boolean)
      // optional claimer to include in participants
      const claimer = req.query.claimer
      if (claimer && typeof claimer === "string" && !participants.includes(claimer)) participants.push(claimer)

      convo = await Conversation.create({ postId: post._id, participants, messages: [] })
    }

    res.json(convo)
  } catch (err) {
    logger.error(`Error in GET /api/chats/post/:postId — ${err.message}`)
    res.status(500).json({ error: "Failed to get/create conversation" })
  }
})

export default router
