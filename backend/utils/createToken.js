import jwt from "jsonwebtoken"

export const createToken = (userId, role = "user") => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || "secret_key", { expiresIn: "7d" })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret_key")
  } catch (err) {
    return null
  }
}
