import dotenv from 'dotenv'
dotenv.config()

import { GoogleGenAI } from '@google/genai'
import logger from './logger.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_GEN_MODEL = process.env.GEMINI_GEN_MODEL || 'gemini-2.5-flash'
const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'text-embedding-004'

// Initialize SDK client eagerly (required dependency)
let ai = null
try {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  logger.info('Google GenAI SDK initialized (static import)')
} catch (err) {
  logger.error('Failed to initialize Google GenAI SDK: ' + (err?.message || err))
  ai = null
}

export function isGeminiAvailable() {
  // Consider Gemini available when an API key is present. We provide an HTTP fallback
  // for embeddings when the SDK doesn't expose embeddings.create.
  return !!GEMINI_API_KEY
}

export async function embedText(text) {
  if (!GEMINI_API_KEY) {
    logger.warn('embedText called but GEMINI_API_KEY is not set')
    return null
  }

  // LOGGING INPUT (Truncated if too long)
  const previewText = text.length > 100 ? text.substring(0, 100) + '...' : text
  logger.info(`[GEMINI DEBUG] Generating embedding for: "${previewText}"`)

  // SDK Attempt
  if (ai && ai.models && typeof ai.models.embedContent === 'function') {
    try {
      // For @google/genai, models.embedContent takes { model, content }
      const resp = await ai.models.embedContent({
        model: GEMINI_EMBED_MODEL,
        content: { parts: [{ text }] }
      })
      // Extract embedding from response
      const emb = resp?.embedding?.values || resp?.embedding || null

      if (emb && Array.isArray(emb)) {
        logger.info(`[GEMINI DEBUG] SDK embedding success. Length: ${emb.length}, First 3 values: [${emb.slice(0, 3).join(', ')}...]`)
        return new Float32Array(emb.map((v) => Number(v)))
      }
      logger.warn('embedText: SDK response missing embedding')
      // Try to log the raw response structure for debugging if it failed
      try { logger.info(`gemini.embedText (sdk) raw failure: ${JSON.stringify(resp).slice(0, 500)}`) } catch (_) { }

    } catch (err) {
      // SDK failed, but we have a fallback. Log as warning only.
      logger.warn('embedText SDK attempt failed (using fallback): ' + (err?.message || err))
    }
  }

  // HTTP Fallback to Google Generative Language embeddings endpoint
  // Docs: https://ai.google.dev/api/embeddings#method:-models.embedcontent
  try {
    const host = process.env.GEMINI_API_HOST || 'https://generativelanguage.googleapis.com'
    const versions = ['v1beta', 'v1']
    const modelCandidates = Array.from(new Set([
      GEMINI_EMBED_MODEL,
      process.env.GEMINI_EMBED_MODEL_ALT,
      'text-embedding-004',
      'textembedding-gecko-001', // Keep gecko for backward compat
    ].filter(Boolean)))

    for (const version of versions) {
      for (const model of modelCandidates) {
        // Use :embedContent which is the standard for modern Gemini models
        const url = `${host}/${version}/models/${encodeURIComponent(model)}:embedContent?key=${encodeURIComponent(GEMINI_API_KEY)}`

        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: `models/${model}`,
              content: { parts: [{ text }] }
            }),
          })

          if (!res.ok) {
            // Only log warning if it's the PRIMARY model failing
            if (model === GEMINI_EMBED_MODEL) {
              const txt = await res.text()
              logger.warn(`embedText HTTP failed (${version}/${model}): ${res.status} ${txt.slice(0, 100)}`)
            }
            continue
          }

          const data = await res.json()
          const emb = data?.embedding?.values || data?.embedding || null

          if (emb && Array.isArray(emb)) {
            logger.info(`[GEMINI DEBUG] HTTP fallback embedding success via ${model}. Length: ${emb.length}`)
            return new Float32Array(emb.map((v) => Number(v)))
          }
        } catch (err) {
          /* ignore network errors on fallback candidates */
        }
      }
    }

    logger.warn('embedText HTTP fallback: all attempts failed')
    return null
  } catch (err) {
    logger.error('embedText HTTP fallback fatal error: ' + (err?.message || err))
    return null
  }
}

export async function describeImage(base64Image) {
  if (!GEMINI_API_KEY) return null
  if (!base64Image) return null

  // Clean base64 string if it has prefix (data:image/jpeg;base64,...)
  const match = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
  let mimeType = 'image/jpeg'
  let data = base64Image

  if (match) {
    mimeType = match[1]
    data = match[2]
  }

  logger.info(`[GEMINI DEBUG] Describing image (mime: ${mimeType}, size: ${data.length} chars)`)

  // Use SDK if available
  if (ai && ai.models && typeof ai.models.generateContent === 'function') {
    try {
      const prompt = "Describe this lost/found item in detail in 1 paragraph. Focus on visual features like color, brand, condition, and distinct markings."
      const resp = await ai.models.generateContent({
        model: GEMINI_GEN_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data } }
            ]
          }
        ]
      })

      const text = resp?.response?.text ? resp.response.text() : (resp?.text || null)
      if (text) {
        logger.info(`[GEMINI DEBUG] Image Description: ${text.slice(0, 100)}...`)
        return text
      }
    } catch (err) {
      logger.warn(`describeImage SDK failed: ${err.message}`)
    }
  }

  // Fallback to HTTP if needed (omitted for brevity as SDK is working for generateContent usually)
  return null
}

export async function generateChat(messagesOrText) {
  if (!GEMINI_API_KEY) {
    logger.warn('generateChat called but GEMINI_API_KEY is not set')
    return null
  }
  if (!ai || !ai.models || !ai.models.generateContent) {
    logger.warn('generateChat: SDK client or models.generateContent not available')
    return null
  }

  // LOGGING INPUT
  let debugInput = ''
  if (typeof messagesOrText === 'string') debugInput = messagesOrText
  else if (Array.isArray(messagesOrText)) debugInput = JSON.stringify(messagesOrText)

  logger.info(`[GEMINI DEBUG] Chat Generate Input: ${debugInput.slice(0, 200)}...`)

  try {
    let resp
    if (typeof messagesOrText === 'string') {
      resp = await ai.models.generateContent({ model: GEMINI_GEN_MODEL, contents: messagesOrText })
    } else if (Array.isArray(messagesOrText)) {
      const joined = messagesOrText.map((m) => m.content || m).join('\n')
      resp = await ai.models.generateContent({ model: GEMINI_GEN_MODEL, contents: joined })
    } else {
      logger.warn('generateChat: unsupported messagesOrText type')
      return null
    }

    // output extraction
    let outputText = ''
    if (typeof resp?.text === 'string') outputText = resp.text
    else if (typeof resp?.outputText === 'string') outputText = resp.outputText
    else if (Array.isArray(resp?.candidates) && resp.candidates[0]?.outputText) outputText = resp.candidates[0].outputText
    else outputText = JSON.stringify(resp)

    logger.info(`[GEMINI DEBUG] Chat Generate Output: ${outputText.slice(0, 200)}...`)

    return outputText
  } catch (err) {
    logger.error('generateChat error: ' + (err?.message || err))
    try { logger.info('generateChat error detail: ' + JSON.stringify(err)) } catch (_) { }
    return null
  }
}

export function cosineSimilarity(a, b) {
  if (!a || !b) return 0
  try {
    const n = Math.min(a.length, b.length)
    let dot = 0, na = 0, nb = 0
    for (let i = 0; i < n; i++) {
      const va = Number(a[i] || 0)
      const vb = Number(b[i] || 0)
      dot += va * vb
      na += va * va
      nb += vb * vb
    }
    if (na === 0 || nb === 0) return 0
    return dot / (Math.sqrt(na) * Math.sqrt(nb))
  } catch (err) {
    logger.warn('cosineSimilarity error: ' + (err?.message || err))
    return 0
  }
}
