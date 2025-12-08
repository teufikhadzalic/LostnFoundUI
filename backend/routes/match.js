import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Post from "../models/Post.js"
import Notification from "../models/Notification.js"
import logger from "../utils/logger.js"
import * as geminiClient from "../utils/geminiClient.js"

const router = express.Router()

// Run matching for a single post (manual trigger). Protected endpoint.
router.post("/post/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    const includeSelf = (process.env.MATCH_INCLUDE_SELF || "false").toString().toLowerCase() === "true"

    const normalize = (s = "") => s.toString().toLowerCase().replace(/[\W_]+/g, " ").split(/\s+/).filter(Boolean)
    const jaccard = (aTokens, bTokens) => {
      const a = new Set(aTokens)
      const b = new Set(bTokens)
      const inter = new Set([...a].filter((x) => b.has(x)))
      const union = new Set([...a, ...b])
      return union.size === 0 ? 0 : inter.size / union.size
    }

    // small helper to simulate thinking delay for AI responses
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
    const randomDelay = (min = 600, max = 1200) => Math.floor(Math.random() * (max - min + 1)) + min

    const oppositeType = post.type === "lost" ? "found" : "lost"
    const candidates = await Post.find({ _id: { $ne: post._id }, status: "active", type: oppositeType, faculty: post.faculty })
    logger.info(`Manual matcher: found ${candidates.length} candidates for post ${post._id}`)

    const newNameTokens = normalize(post.itemName)
    const newDescTokens = normalize(post.description)

    const matches = []
    const heuristicMatches = []
    const aiMatches = []

    // Try to get embedding for the new post — prefer cached embedding on the Post document
    let newEmb = null
    try {
      // Consider GEMINI available when either MATCH_USE_GEMINI=true and the client reports availability,
      // or when a GEMINI_API_KEY is present in the env (simple convenience fallback).
      const envHasKey = !!process.env.GEMINI_API_KEY
      const useGemini = (process.env.MATCH_USE_GEMINI === "true" && geminiClient.isGeminiAvailable()) || envHasKey
      if (useGemini) {
        if (post.embedding && Array.isArray(post.embedding) && post.embedding.length > 0) {
          newEmb = new Float32Array(post.embedding)
          logger.info(`Manual matcher: using cached embedding for post ${post._id}`)
        } else {
          // Try to get embedding via geminiClient (SDK) if available.
          let textToEmbed = `${post.itemName}\n${post.description}`
          if (post.image) {
            const imgDesc = await geminiClient.describeImage(post.image)
            if (imgDesc) textToEmbed += `\n[Image Visual Context]: ${imgDesc}`
          }

          const got = await geminiClient.embedText(textToEmbed)
          if (got) {
            newEmb = got
            try {
              post.embedding = Array.from(got)
              await post.save()
              logger.info(`Manual matcher: cached embedding for post ${post._id}`)
            } catch (saveErr) {
              logger.warn(`Manual matcher: failed to save embedding for post ${post._id}: ${saveErr.message}`)
            }
          }
        }
      }
    } catch (e) {
      logger.warn(`Manual matcher: failed to get embedding for post ${post._id}: ${e.message}`)
      newEmb = null
    }

    for (const cand of candidates) {
      if (!includeSelf) {
        try {
          if (cand.userId.toString() === post.userId.toString()) continue
        } catch (e) {
          logger.warn(`Manual matcher: userId compare failed for ${cand._id}`)
          continue
        }
      }

      const candNameTokens = normalize(cand.itemName)
      const candDescTokens = normalize(cand.description)
      const nameSim = jaccard(newNameTokens, candNameTokens)
      const descSim = jaccard(newDescTokens, candDescTokens)
      let heuristicScore = Math.max(nameSim, descSim)
      if (cand.category === post.category) heuristicScore += 0.15
      if (cand.location && post.location && cand.location.toLowerCase() === post.location.toLowerCase()) heuristicScore += 0.1
      heuristicScore = Math.min(heuristicScore, 1)

      // Compute embedding score if AI available. Prefer cached embeddings; if embeddings are not available
      // (SDK doesn't expose embeddings or API key not allowed), fall back to text-based scoring using Gemini
      // by asking the model to return a numeric similarity score (0.0 - 1.0) in JSON.
      let embeddingScore = null
      if (newEmb) {
        try {
          // Prefer cached candidate embedding if present
          let candEmb = null
          if (cand.embedding && Array.isArray(cand.embedding) && cand.embedding.length > 0) {
            candEmb = new Float32Array(cand.embedding)
          } else {
            // request embedding from provider
            try {
              let candText = `${cand.itemName}\n${cand.description}`
              if (cand.image) {
                const cImgDesc = await geminiClient.describeImage(cand.image)
                if (cImgDesc) candText += `\n[Image Visual Context]: ${cImgDesc}`
              }

              const got = await geminiClient.embedText(candText)
              if (got) {
                candEmb = got
                // cache candidate embedding
                try {
                  cand.embedding = Array.from(got)
                  await cand.save()
                  logger.info(`Manual matcher: cached embedding for candidate ${cand._id}`)
                } catch (saveErr) {
                  logger.warn(`Manual matcher: failed to cache candidate embedding ${cand._id}: ${saveErr.message}`)
                }
              }
            } catch (e) {
              logger.warn(`Manual matcher: failed to obtain embedding for candidate ${cand._id}: ${e.message}`)
            }
          }

          if (candEmb) embeddingScore = geminiClient.cosineSimilarity(newEmb, candEmb)
        } catch (e) {
          logger.warn(`Manual matcher: failed to compute embedding similarity for ${cand._id}: ${e.message}`)
        }
      } else if (process.env.MATCH_USE_GEMINI === "true") {
        // embeddings not available — use text-based scoring prompt
        try {
          const prompt = `Rate the semantic similarity between two lost-and-found items on a scale from 0.0 (completely different) to 1.0 (identical).\nReturn only a JSON object like {"score": 0.87}.\n\nItem A:\nName: ${post.itemName || ''}\nDescription: ${post.description || ''}\nCategory: ${post.category || ''}\nLocation: ${post.location || ''}\n\nItem B:\nName: ${cand.itemName || ''}\nDescription: ${cand.description || ''}\nCategory: ${cand.category || ''}\nLocation: ${cand.location || ''}`
          const resp = await geminiClient.generateChat(prompt)
          // add a small randomized delay so the UI feels like the model is "thinking"
          try {
            await sleep(randomDelay())
          } catch (e) {
            /* ignore */
          }
          if (resp) {
            let parsed = null
            try {
              parsed = JSON.parse(resp)
            } catch (e) {
              // try to find a number in the text
              const m = resp.match(/([-+]?[0-9]*\.?[0-9]+)/)
              if (m) parsed = { score: parseFloat(m[0]) }
            }
            if (parsed && typeof parsed.score === 'number' && !Number.isNaN(parsed.score)) {
              embeddingScore = Math.max(0, Math.min(1, parsed.score))
            }
          }
        } catch (e) {
          logger.warn(`Manual matcher: text-based Gemini scoring failed for ${cand._id}: ${e.message}`)
        }
      }

      // Decide matches separately for heuristic and AI
      const heuristicThreshold = parseFloat(process.env.MATCH_HEURISTIC_THRESHOLD || process.env.MATCH_SIMILARITY_THRESHOLD || "0.25")
      const aiThreshold = parseFloat(process.env.MATCH_AI_THRESHOLD || process.env.MATCH_SIMILARITY_THRESHOLD || "0.75")

      if (heuristicScore >= heuristicThreshold) {
        heuristicMatches.push({ id: cand._id, score: heuristicScore })
      }
      if (embeddingScore !== null && embeddingScore >= aiThreshold) {
        aiMatches.push({ id: cand._id, score: embeddingScore })
      }
      // for backward compatibility, keep combined list that uses conservative final score
      let finalScore = heuristicScore
      if (embeddingScore !== null) finalScore = Math.max(heuristicScore, embeddingScore * 0.95)
      if (finalScore >= (embeddingScore !== null ? aiThreshold : heuristicThreshold)) {
        matches.push({ cand, score: finalScore })
      }
    }

    // create notifications
    for (const { cand, score } of matches) {
      try {
        const notif1 = new Notification({ userId: cand.userId, type: "match_found", message: `Kemungkinan kecocokan ditemukan untuk posting Anda \"${cand.itemName}\"`, postId: post._id })
        await notif1.save()
        const notif2 = new Notification({ userId: post.userId, type: "match_found", message: `Ditemukan posting yang cocok: \"${cand.itemName}\" (score=${score.toFixed(2)})`, postId: cand._id })
        await notif2.save()
      } catch (e) {
        logger.error(`Manual matcher: failed to create notification: ${e.message}`)
      }
    }

    const useGemini = process.env.MATCH_USE_GEMINI === "true" && geminiClient.isGeminiAvailable()
    // prepare response lists
    const combined = matches.map((m) => ({ id: m.cand._id, score: m.score }))
    return res.json({
      matched: combined.length,
      mode: useGemini ? "ai" : "heuristic",
      combinedMatches: combined,
      heuristicMatches,
      aiMatches,
    })
  } catch (err) {
    logger.error(`Manual matcher error: ${err.message}`)
    return res.status(500).json({ error: "Failed to run manual matcher" })
  }
})

// Return current matching mode (AI vs heuristic)
router.get("/mode", (req, res) => {
  try {
    const useGemini = process.env.MATCH_USE_GEMINI === "true" && geminiClient.isGeminiAvailable()
    return res.json({ mode: useGemini ? "ai" : "heuristic", useGemini })
  } catch (e) {
    return res.json({ mode: "heuristic", useGemini: false })
  }
})

export default router
