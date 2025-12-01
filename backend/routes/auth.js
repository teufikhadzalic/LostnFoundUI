import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { createToken, verifyToken } from "../utils/createToken.js"
import logger from "../utils/logger.js"
import { XMLParser } from "fast-xml-parser"

const router = express.Router()

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, role, faculty, npm, username } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: "Email sudah terdaftar" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("DEBUG REGISTER:")
    console.log("  email:", email)
    console.log("  plain password:", password)
    console.log("  hashed password:", hashedPassword)

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      faculty,
      npm: npm || undefined,
      username: username || email,
    })

    await user.save()
    console.log("  saved user password field:", user.password)

  const token = createToken(user._id, user.role)
    logger.info(`User registered successfully: ${email}`)

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        faculty: user.faculty,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      logger.warn(`POST /api/login — invalid credentials for: ${email}`)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    console.log("DEBUG LOGIN:")
    console.log("  email:", email)
    console.log("  plain password:", password)
    console.log("  stored password hash:", user.password)
    console.log("  stored password length:", user.password?.length)

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("  bcrypt.compare result:", passwordMatch)

    if (!passwordMatch) {
      logger.warn(`POST /api/login — invalid credentials for: ${email}`)
      return res.status(401).json({ error: "Invalid credentials" })
    }

  const token = createToken(user._id, user.role)
    logger.info(`User logged in: ${email}`)

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        faculty: user.faculty,
      },
    })
  } catch (err) {
    next(err)
  }
})

// --- Generic OAuth2 SSO flow -------------------------------------------------
// Requires these environment variables in backend/.env:
// SSO_CLIENT_ID, SSO_CLIENT_SECRET, SSO_AUTH_URL, SSO_TOKEN_URL, SSO_USERINFO_URL,
// SSO_CALLBACK_URL (optional) and FRONTEND_URL (optional)

// Support both OAuth2-style providers and CAS-based providers (UI uses CAS)
router.get("/sso", (req, res) => {
  const authUrl = process.env.SSO_AUTH_URL
  const callback = process.env.SSO_CALLBACK_URL || `${process.env.BASE_URL || "http://localhost:5000"}/api/auth/sso/callback`

  if (!authUrl) {
    logger.warn("SSO not configured: missing SSO_AUTH_URL")
    return res.status(500).send("SSO not configured on server")
  }

  const trimmed = authUrl.replace(/\/$/, "")
  // Detect CAS by presence of '/cas' in URL or explicit protocol env
  const isCas = (process.env.SSO_PROTOCOL || "").toLowerCase() === "cas" || /\/cas\/?$/i.test(trimmed) || /cas(\.|\/)/i.test(trimmed)

  if (isCas) {
    // CAS login endpoint
    const loginUrl = `${trimmed}/login?service=${encodeURIComponent(callback)}`
    return res.redirect(loginUrl)
  }

  // Fallback to OAuth2 Authorization Code flow
  const clientId = process.env.SSO_CLIENT_ID
  if (!clientId) {
    logger.warn("SSO not configured for OAuth2: missing SSO_CLIENT_ID")
    return res.status(500).send("SSO not configured on server")
  }

  const redirectUrl = `${authUrl}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(callback)}&response_type=code&scope=openid%20profile%20email`
  return res.redirect(redirectUrl)
})

router.get("/sso/callback", async (req, res) => {
  try {
    const authUrl = process.env.SSO_AUTH_URL
    if (!authUrl) return res.status(500).send("SSO not configured")

    const trimmed = authUrl.replace(/\/$/, "")
    const isCas = (process.env.SSO_PROTOCOL || "").toLowerCase() === "cas" || /\/cas\/?$/i.test(trimmed) || /cas(\.|\/)/i.test(trimmed)

    let email = null
    let name = null

  if (isCas) {
      // CAS returns a ticket query parameter which must be validated
      const ticket = req.query.ticket
      if (!ticket) return res.status(400).send("Missing ticket from CAS")

      const validateUrl = `${trimmed}/serviceValidate?service=${encodeURIComponent(process.env.SSO_CALLBACK_URL || `${process.env.BASE_URL || "http://localhost:5000"}/api/auth/sso/callback`)}&ticket=${encodeURIComponent(String(ticket))}`
      // Try p3 if available (some CAS servers expose p3/serviceValidate)
      const p3 = `${trimmed}/p3/serviceValidate?service=${encodeURIComponent(process.env.SSO_CALLBACK_URL || `${process.env.BASE_URL || "http://localhost:5000"}/api/auth/sso/callback`)}&ticket=${encodeURIComponent(String(ticket))}`

      // Try p3 first then fallback
      let vresp = await fetch(p3)
      if (!vresp.ok) vresp = await fetch(validateUrl)

      if (!vresp.ok) {
        const txt = await vresp.text().catch(() => "")
        logger.error(`CAS validation failed: ${txt}`)
        return res.status(502).send("CAS validation failed")
      }

      const bodyText = await vresp.text()
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" })
      let parsed
      try {
        parsed = parser.parse(bodyText)
      } catch (e) {
        logger.error(`Failed to parse CAS response: ${e.message}`)
        return res.status(502).send("CAS parse failed")
      }

      // Navigate common CAS response shapes to find authenticationSuccess
      let authSuccess = null
      if (parsed["cas:serviceResponse"] && parsed["cas:serviceResponse"]["cas:authenticationSuccess"]) authSuccess = parsed["cas:serviceResponse"]["cas:authenticationSuccess"]
      else if (parsed.serviceResponse && parsed.serviceResponse.authenticationSuccess) authSuccess = parsed.serviceResponse.authenticationSuccess
      else if (parsed["cas:serviceResponse"] && parsed["cas:serviceResponse"].authenticationSuccess) authSuccess = parsed["cas:serviceResponse"].authenticationSuccess
      else {
        // generic deep search
        const findAuth = (o) => {
          if (!o || typeof o !== "object") return null
          for (const k of Object.keys(o)) {
            if (k.toLowerCase().includes("authent") && o[k]) return o[k]
            const nested = findAuth(o[k])
            if (nested) return nested
          }
          return null
        }
        authSuccess = findAuth(parsed)
      }

      const userId = authSuccess?.["cas:user"] || authSuccess?.user || null
      const attrs = authSuccess?.["cas:attributes"] || authSuccess?.attributes || authSuccess

      const getAttr = (obj, names) => {
        if (!obj) return null
        for (const n of names) {
          if (obj[n]) return obj[n]
        }
        return null
      }

      const mail = getAttr(attrs, ["cas:mail", "mail", "email", "cas:email", "mailAddress"])
      const display = getAttr(attrs, ["cas:displayName", "displayName", "givenName", "cn", "name"])

      email = mail || (userId ? `${userId}@ui.ac.id` : null)
      name = display || userId
    } else {
      // OAuth2 generic flow (authorization code)
      const code = req.query.code
      if (!code) return res.status(400).send("Missing code")

      const tokenUrl = process.env.SSO_TOKEN_URL
      const clientId = process.env.SSO_CLIENT_ID
      const clientSecret = process.env.SSO_CLIENT_SECRET
      const callback = process.env.SSO_CALLBACK_URL || `${process.env.BASE_URL || "http://localhost:5000"}/api/auth/sso/callback`

      if (!tokenUrl || !clientId || !clientSecret) {
        logger.warn("SSO token exchange not configured properly")
        return res.status(500).send("SSO not configured on server")
      }

      const params = new URLSearchParams()
      params.append("grant_type", "authorization_code")
      params.append("code", String(code))
      params.append("client_id", clientId)
      params.append("client_secret", clientSecret)
      params.append("redirect_uri", callback)

      const tokenResp = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      })

      if (!tokenResp.ok) {
        const txt = await tokenResp.text()
        logger.error(`SSO token exchange failed: ${txt}`)
        return res.status(502).send("SSO token exchange failed")
      }

      const tokenData = await tokenResp.json()
      const accessToken = tokenData.access_token

      const userInfoUrl = process.env.SSO_USERINFO_URL
      let profile = null
      if (userInfoUrl && accessToken) {
        const ui = await fetch(userInfoUrl, { headers: { Authorization: `Bearer ${accessToken}` } })
        if (ui.ok) profile = await ui.json()
      }

      email = profile?.email || profile?.preferred_username || profile?.sub
      name = profile?.name || profile?.given_name || profile?.preferred_username || email
    }

    if (!email) {
      logger.error("SSO did not provide a usable email or identifier")
      return res.status(400).send("SSO did not provide user email")
    }

    // Find or create user
    let user = await User.findOne({ email })
    if (!user) {
      const defaultRole = process.env.SSO_DEFAULT_ROLE || "user"
      // Allow promoting users from certain domains to officer via SSO_OFFICER_DOMAINS
      const officerDomains = (process.env.SSO_OFFICER_DOMAINS || "").split(",").map((s) => s.trim()).filter(Boolean)
      let role = defaultRole
      if (officerDomains.length && officerDomains.some((d) => email.endsWith(d))) role = "officer"

      user = new User({ email, name, role })
      await user.save()
    }

    const jwtToken = createToken(user._id, user.role)

    // Set httpOnly cookie (safer than passing token in URL)
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    const frontend = process.env.FRONTEND_URL || "http://localhost:3000"
    return res.redirect(`${frontend}/auth/sso/callback`)
  } catch (err) {
    logger.error(`Error in SSO callback: ${err.message}`)
    return res.status(500).send("SSO callback error")
  }
})

// Return currently authenticated user's minimal info (reads token from cookie or Authorization header)
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1])
    if (!token) return res.status(401).json({ error: "Not authenticated" })

    const payload = verifyToken(token)
    if (!payload || !payload.userId) return res.status(401).json({ error: "Invalid token" })

    const user = await User.findById(payload.userId).select("email name role faculty npm username")
    if (!user) return res.status(404).json({ error: "User not found" })

    return res.json({ id: user._id, email: user.email, name: user.name, role: user.role, faculty: user.faculty, npm: user.npm, username: user.username })
  } catch (err) {
    logger.error(`GET /api/auth/me error: ${err.message}`)
    return res.status(500).json({ error: "Server error" })
  }
})

// CAS logout: clear local cookie then redirect to provider logout
router.get("/sso/logout", (req, res) => {
  const authUrl = process.env.SSO_AUTH_URL
  const trimmed = authUrl ? authUrl.replace(/\/$/, "") : (process.env.SSO_LOGOUT_URL || null)
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000"

  res.clearCookie("token")
  const logoutUrl = process.env.SSO_LOGOUT_URL || (trimmed ? `${trimmed}/logout` : null)
  if (!logoutUrl) return res.redirect(frontend)

  return res.redirect(`${logoutUrl}?service=${encodeURIComponent(frontend)}`)
})

export default router
