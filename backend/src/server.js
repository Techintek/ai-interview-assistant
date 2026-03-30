import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import interviewRoutes from "./routes/interviewRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import jobRoleRoutes from "./routes/jobRoleRoutes.js"
import invitationRoutes from "./routes/invitationRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"

dotenv.config()

const app = express()

import cors from "cors"

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-interview-assistant-sable-one.vercel.app"
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))
app.use(express.json())
app.use("/api/jobrole", jobRoleRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/invite", invitationRoutes)
app.use("/api/reports", reportRoutes)

app.use("/api/interview", (req, res, next) => {
  console.log("Interview route hit:", req.url)
  next()
}, interviewRoutes)

app.get("/", (req, res) => {
  res.send("AI Interview API running")
})

const PORT = process.env.PORT || 5001
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})