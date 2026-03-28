import express from "express"
import { generateInterviewQuestions } from "../services/aiService.js"
import { getInterviewByToken } from "../controllers/interviewController.js"
import { submitInterview } from "../controllers/interviewController.js"

const router = express.Router()

router.post("/question", async (req, res) => {
  try {
    const { candidateInfo, difficulty, questionNumber } = req.body

    const question = await generateInterviewQuestions(
      candidateInfo,
      difficulty,
      questionNumber
    )

    res.json({ question })

  } catch (error) {
    res.status(500).json({ error: "Failed to generate question" })
  }
})
console.log("Interview routes loaded")
router.get("/:token", getInterviewByToken)
router.post("/submit", submitInterview)

export default router