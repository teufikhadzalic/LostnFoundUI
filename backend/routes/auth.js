import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { createToken } from "../utils/createToken.js"
import logger from "../utils/logger.js"

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

    const token = createToken(user._id)
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

    const token = createToken(user._id)
    logger.info(`User logged in: ${email}`)

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        faculty: user.facility,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
