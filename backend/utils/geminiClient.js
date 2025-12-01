import dotenv from 'dotenv'
dotenv.config()

import { GoogleGenAI } from '@google/genai'
import logger from './logger.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_GEN_MODEL = process.env.GEMINI_GEN_MODEL || 'gemini-2.5-flash'
const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'textembedding-gecko-001'

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

  // Use SDK embedding if available
  if (ai && ai.embeddings && typeof ai.embeddings.create === 'function') {
    try {
      const resp = await ai.embeddings.create({ model: GEMINI_EMBED_MODEL, input: text })
      logger.info(`gemini.embedText (sdk) response: ${JSON.stringify(resp).slice(0, 2000)}`)
      const emb = resp?.data?.[0]?.embedding || resp?.embedding || null
      if (!emb || !Array.isArray(emb)) {
        logger.warn('embedText: embedding missing in SDK response')
        return null
      }
      return new Float32Array(emb.map((v) => Number(v)))
    } catch (err) {
      logger.error('embedText SDK error: ' + (err?.message || err))
      try { logger.info('embedText SDK error detail: ' + JSON.stringify(err)) } catch (_) {}
      // fall through to HTTP fallback
    }
  } else {
    logger.warn('embedText: SDK client or embeddings.create not available — falling back to HTTP REST call')
  }

  // HTTP fallback to Google Generative Language embeddings endpoint
  try {
    const host = process.env.GEMINI_API_HOST || 'https://generativelanguage.googleapis.com'
    const versions = ['v1', 'v1beta']
    const modelCandidates = Array.from(new Set([
      GEMINI_EMBED_MODEL,
      process.env.GEMINI_EMBED_MODEL_ALT,
      'textembedding-gecko-001',
      'embed-text-v1',
    ].filter(Boolean)))

    for (const version of versions) {
      for (const model of modelCandidates) {
        const url = `${host}/${version}/models/${encodeURIComponent(model)}:embed?key=${encodeURIComponent(GEMINI_API_KEY)}`
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: text }),
          })
          const txt = await res.text()
          try { logger.info(`gemini.embedText (http) attempt version=${version} model=${model} status=${res.status} body=${txt.slice(0,2000)}`) } catch (_) {}
          if (!res.ok) {
            logger.warn(`embedText HTTP attempt failed for model=${model} version=${version}: ${res.status} ${res.statusText}`)
            // continue trying other model/version combos
            continue
          }
          const data = JSON.parse(txt)
          const emb = data?.data?.[0]?.embedding || data?.embedding || null
          if (!emb || !Array.isArray(emb)) {
            logger.warn(`embedText: embedding missing in HTTP response for model=${model} version=${version}`)
            continue
          }
          return new Float32Array(emb.map((v) => Number(v)))
        } catch (err) {
          logger.warn(`embedText HTTP attempt error for model=${model} version=${version}: ${err?.message || err}`)
          // try next
        }
      }
    }

    logger.warn('embedText HTTP fallback: all attempts failed (404/invalid model or API key may be restricted)')
    return null
  } catch (err) {
    logger.error('embedText HTTP fallback error: ' + (err?.message || err))
    try { logger.info('embedText HTTP error detail: ' + JSON.stringify(err)) } catch (_) {}
    return null
  }
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

    // Debug log (truncate to avoid huge logs)
    try { logger.info(`gemini.generateChat response: ${JSON.stringify(resp).slice(0, 2000)}`) } catch (e) {}

    if (typeof resp?.text === 'string') return resp.text
    if (typeof resp?.outputText === 'string') return resp.outputText
    if (Array.isArray(resp?.candidates) && resp.candidates[0]?.outputText) return resp.candidates[0].outputText
    // fallback: stringify
    return JSON.stringify(resp)
  } catch (err) {
    logger.error('generateChat error: ' + (err?.message || err))
    try { logger.info('generateChat error detail: ' + JSON.stringify(err)) } catch (_) {}
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
