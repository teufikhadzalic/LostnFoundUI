import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import Post from "../models/Post.js"
import Notification from "../models/Notification.js"
import logger from "../utils/logger.js"
import * as geminiClient from "../utils/geminiClient.js"

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
    // If Gemini is enabled, attempt to obtain and cache embedding for the new post
    try {
      const useGemini = (process.env.MATCH_USE_GEMINI || "false").toString().toLowerCase() === "true" && geminiClient.isGeminiAvailable()
      if (useGemini) {
        let textToEmbed = `${post.itemName} \n ${post.description}`

        // Enrich with image description if image is present
        if (post.image) {
          try {
            const imageDesc = await geminiClient.describeImage(post.image)
            if (imageDesc) {
              textToEmbed += `\n[Image Visual Context]: ${imageDesc}`
              // Optionally append to internal post description or just use for embedding?
              // For now, only using it for embedding to keep user description clean.
            }
          } catch (imgErr) {
            logger.warn(`Failed to describe image for post ${post._id}: ${imgErr.message}`)
          }
        }

        const emb = await geminiClient.embedText(textToEmbed)
        if (emb && emb.length) {
          post.embedding = Array.from(emb)
          await post.save()
          logger.info(`Cached embedding for post ${post._id} (with image context)`)
        }
      }
    } catch (e) {
      logger.warn(`Failed to cache embedding for new post ${post._id}: ${e.message}`)
    }
    logger.info(`Post created successfully: ${post._id}`)
      // After creating a post, run a lightweight matching routine to find possible matches
      // between lost and found posts. This is a simple heuristic-based matcher (no external AI).
      ; (async function runMatching(newPost) {
        try {
          logger.info(`Running matcher for post ${newPost._id} - "${newPost.itemName}" (type=${newPost.type})`)
          const includeSelf = (process.env.MATCH_INCLUDE_SELF || "false").toString().toLowerCase() === "true"
          logger.info(`Matcher includeSelf=${includeSelf}`)
          const useGemini = (process.env.MATCH_USE_GEMINI || "false").toString().toLowerCase() === "true" && geminiClient.isGeminiAvailable()
          if (useGemini) logger.info("Matcher: GEMINI semantic embeddings enabled")
          // helper: normalize and tokenise text
          const normalize = (s = "") =>
            s
              .toString()
              .toLowerCase()
              .replace(/[\W_]+/g, " ")
              .split(/\s+/)
              .filter(Boolean)

          const jaccard = (aTokens, bTokens) => {
            const a = new Set(aTokens)
            const b = new Set(bTokens)
            const inter = new Set([...a].filter((x) => b.has(x)))
            const union = new Set([...a, ...b])
            return union.size === 0 ? 0 : inter.size / union.size
          }

          const oppositeType = newPost.type === "lost" ? "found" : "lost"

          // Search candidates within same faculty and active status for performance
          const candidates = await Post.find({
            _id: { $ne: newPost._id },
            status: "active",
            type: oppositeType,
            faculty: newPost.faculty,
          })
          logger.info(`Matcher: found ${candidates.length} candidates to compare`)

          const newNameTokens = normalize(newPost.itemName)
          const newDescTokens = normalize(newPost.description)

          const matches = []

          // If Gemini allowed, request embedding for the new post once
          // If Gemini allowed, use cached embedding or generate new enriched one
          let newEmb = null
          if (useGemini) {
            // Priority 1: Use the embedding we just saved (which includes image context)
            if (newPost.embedding && newPost.embedding.length > 0) {
              newEmb = new Float32Array(newPost.embedding)
              logger.info(`Matcher: used cached embedding for new post (${newPost._id})`)
            } else {
              // Priority 2: Generate fresh (fallback)
              try {
                let textToEmbed = `${newPost.itemName} \n ${newPost.description}`
                if (newPost.image) {
                  const imgDesc = await geminiClient.describeImage(newPost.image)
                  if (imgDesc) textToEmbed += `\n[Image Visual Context]: ${imgDesc}`
                }
                newEmb = await geminiClient.embedText(textToEmbed)
              } catch (e) {
                logger.warn(`Matcher: failed to get embedding for new post ${newPost._id}: ${e.message}`)
              }
            }
          }

          for (const cand of candidates) {
            // skip same user unless configured to include self-matches
            if (!includeSelf) {
              try {
                if (cand.userId.toString() === newPost.userId.toString()) {
                  logger.info(`Matcher: skipping candidate ${cand._id} because it's from the same user (${cand.userId})`)
                  continue
                }
              } catch (e) {
                logger.warn(`Matcher: could not compare userId for candidate ${cand._id}: ${e.message}`)
                continue
              }
            }

            const candNameTokens = normalize(cand.itemName)
            const candDescTokens = normalize(cand.description)

            // name similarity and description similarity
            const nameSim = jaccard(newNameTokens, candNameTokens)
            const descSim = jaccard(newDescTokens, candDescTokens)

            // small boost if category or location matches
            let heuristicScore = Math.max(nameSim, descSim) // primary
            if (cand.category === newPost.category) heuristicScore += 0.15
            if (cand.location && newPost.location && cand.location.toLowerCase() === newPost.location.toLowerCase()) heuristicScore += 0.1
            heuristicScore = Math.min(heuristicScore, 1)

            // Try semantic embedding similarity when available
            let embeddingScore = null
            if (newEmb) {
              try {
                let candEmb = null
                // 1. Try cached
                if (cand.embedding && cand.embedding.length > 0) {
                  candEmb = new Float32Array(cand.embedding)
                }
                // 2. Generate if missing
                if (!candEmb) {
                  let candText = `${cand.itemName} \n ${cand.description}`
                  if (cand.image) {
                    const cImgDesc = await geminiClient.describeImage(cand.image)
                    if (cImgDesc) candText += `\n[Image Visual Context]: ${cImgDesc}`
                  }
                  candEmb = await geminiClient.embedText(candText)

                  // Cache it
                  if (candEmb && candEmb.length > 0) {
                    cand.embedding = Array.from(candEmb)
                    await cand.save()
                    logger.info(`Matcher: Generated and cached embedding for candidate ${cand._id}`)
                  }
                }

                if (candEmb && candEmb.length === newEmb.length) {
                  embeddingScore = geminiClient.cosineSimilarity(newEmb, candEmb)
                  logger.info(`Matcher embedding sim: cand=${cand._id} embSim=${embeddingScore.toFixed(3)}`)
                }
              } catch (e) {
                logger.warn(`Matcher: failed to comparison for candidate ${cand._id}: ${e.message}`)
              }
            }

            // Final score: if embedding available, prefer it (weighted) otherwise heuristic
            // Weighting: embedding 0.8, heuristic 0.2
            let score = heuristicScore
            if (embeddingScore !== null) {
              score = Math.max(heuristicScore, embeddingScore * 0.95) // keep a conservative mapping: favor embedding but preserve heuristic bumps
            }

            // threshold — prefer higher threshold for embeddings
            const defaultThreshold = embeddingScore !== null ? parseFloat(process.env.MATCH_SIMILARITY_THRESHOLD || "0.75") : parseFloat(process.env.MATCH_SIMILARITY_THRESHOLD || "0.25")
            logger.info(`Matcher compare: cand=${cand._id} nameSim=${nameSim.toFixed(2)} descSim=${descSim.toFixed(2)} heuristic=${heuristicScore.toFixed(2)} finalScore=${score.toFixed(2)} threshold=${defaultThreshold}`)
            if (score >= defaultThreshold) {
              matches.push({ cand, score })
            }
          }

          if (matches.length > 0) {
            logger.info(`Found ${matches.length} match(es) for post ${newPost._id}`)
          }

          // create notifications for each match: notify the owner of the existing candidate
          // and notify the author of the new post about the existing candidate
          for (const { cand, score } of matches) {
            try {
              const messageForCandidate = `Kemungkinan kecocokan ditemukan untuk posting Anda \"${cand.itemName}\" — Lihat detail: \"${newPost.itemName}\".`
              const notif1 = new Notification({
                userId: cand.userId,
                type: "match_found",
                message: messageForCandidate,
                postId: newPost._id,
              })
              await notif1.save()

              const messageForNewAuthor = `Kami menemukan posting yang mungkin cocok dengan laporan Anda \"${newPost.itemName}\" — lihat posting lain: \"${cand.itemName}\" (score=${score.toFixed(2)}).`
              const notif2 = new Notification({
                userId: newPost.userId,
                type: "match_found",
                message: messageForNewAuthor,
                postId: cand._id,
              })
              await notif2.save()
            } catch (notifErr) {
              logger.error(`Failed to create match notification: ${notifErr.message}`)
            }
          }
        } catch (matchErr) {
          logger.error(`Error during post matching: ${matchErr.message}`)
        }
      })(post).catch((e) => logger.error(`Matcher invocation error: ${e.message}`))
    res.status(201).json(post)
  } catch (err) {
    logger.error(`Error in POST /api/posts — ${err.message}`)
    res.status(500).json({ error: "Failed to create post" })
  }
})

// DELETE a post (only owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      logger.warn(`DELETE /api/posts/:id — post not found: ${req.params.id}`)
      return res.status(404).json({ error: "Post not found" })
    }

    // Check ownership
    if (post.userId.toString() !== req.user.userId.toString()) {
      logger.warn(`DELETE /api/posts/:id — unauthorized delete attempt by ${req.user.userId}`)
      return res.status(403).json({ error: "Not authorized to delete this post" })
    }

    // Remove the post
    await Post.findByIdAndDelete(req.params.id)

    // Cleanup notifications that reference this post
    try {
      await Notification.deleteMany({ postId: req.params.id })
    } catch (notifErr) {
      logger.error(`Error cleaning notifications for deleted post ${req.params.id}: ${notifErr.message}`)
    }

    logger.info(`Post deleted: ${req.params.id} by user ${req.user.userId}`)
    return res.json({ message: "Post deleted" })
  } catch (err) {
    logger.error(`Error in DELETE /api/posts/:id — ${err.message}`)
    return res.status(500).json({ error: "Failed to delete post" })
  }
})

router.get("/", async (req, res) => {
  try {
    const { faculty, category, search, type, status } = req.query
    const filter = {}

    // Status Filter (Default to active + claimed if not specified)
    if (status) {
      const statuses = status.split(',').filter(Boolean)
      if (statuses.length > 0) filter.status = { $in: statuses }
    } else {
      filter.status = { $in: ["active", "claimed"] }
    }

    if (faculty) {
      const faculties = faculty.split(',').filter(Boolean)
      if (faculties.length > 0) filter.faculty = { $in: faculties }
    }
    if (category) {
      const categories = category.split(',').filter(Boolean)
      if (categories.length > 0) filter.category = { $in: categories }
    }
    if (type) {
      const types = type.split(',').filter(Boolean)
      if (types.length > 0) filter.type = { $in: types }
    }
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
