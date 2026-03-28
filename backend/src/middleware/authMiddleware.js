import jwt from "jsonwebtoken"

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // attach user info
    req.user = decoded

    console.log("Authenticated user:", decoded) // helpful debug

    next()

  } catch (error) {
    console.error("Auth error:", error)

    return res.status(401).json({
      error: "Invalid token"
    })
  }
}