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


app.use(cors({
  origin: "http://localhost:5173",
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})