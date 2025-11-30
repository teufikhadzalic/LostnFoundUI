import { verifyToken } from "../utils/createToken.js"
import logger from "../utils/logger.js"

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    logger.warn("Unauthorized access attempt — no token provided")
    return res.status(401).json({ error: "Unauthorized" })
  }
  const decoded = verifyToken(token)
  if (!decoded) {
    logger.warn("Unauthorized access attempt — invalid token")
    return res.status(401).json({ error: "Invalid token" })
  }
  req.user = decoded
  next()
}

export const officerMiddleware = (req, res, next) => {
  if (req.user?.role !== "officer") {
    logger.warn(`Unauthorized officer access attempt by user ${req.user?.userId}`)
    return res.status(403).json({ error: "Officer access required" })
  }
  next()
}
