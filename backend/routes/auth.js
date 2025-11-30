import express from "express"
import User from "../models/User.js"
import { createToken } from "../utils/createToken.js"
import logger from "../utils/logger.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, npm, faculty, role } = req.body

    if (!email || !password || !name || !role) {
      logger.warn("POST /api/register — missing required fields")
      return res.status(400).json({ error: "Missing required fields" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      logger.warn(`POST /api/register — email already exists: ${email}`)
      return res.status(400).json({ error: "Email already exists" })
    }

    const user = new User({ email, password, name, npm, faculty, role })
    await user.save()
    logger.info(`User registered successfully: ${email}`)

    const token = createToken(user._id, user.role)
    res.status(201).json({ token, user: { id: user._id, email, name, role } })
  } catch (err) {
    logger.error(`Error in POST /api/register — ${err.message}`)
    res.status(500).json({ error: "Registration failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      logger.warn("POST /api/login — missing email or password")
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`POST /api/login — invalid credentials for: ${email}`)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = createToken(user._id, user.role)
    logger.info(`User logged in: ${email}`)
    res.json({ token, user: { id: user._id, email, name: user.name, role: user.role } })
  } catch (err) {
    logger.error(`Error in POST /api/login — ${err.message}`)
    res.status(500).json({ error: "Login failed" })
  }
})

export default router
