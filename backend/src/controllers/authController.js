import prisma from "../db/prismaClient.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.json({
      message: "User created successfully",
      user
    })

  } catch (error) {
    console.error("REGISTER ERROR:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({ error: "Login failed" })
  }
}