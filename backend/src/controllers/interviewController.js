import prisma from "../db/prismaClient.js"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
})
// ---------------- GET INTERVIEW BY TOKEN ----------------
// ---------------- GET INTERVIEW BY TOKEN ----------------
export const getInterviewByToken = async (req, res) => {
  try {
    const { token } = req.params

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        jobRole: {
          include: {
            questions: true
          }
        }
      }
    })

    if (!invitation) {
      return res.status(404).json({ error: "Invalid token" })
    }

    // optional: expiry check
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return res.status(400).json({ error: "Link expired" })
    }

    res.json({
      jobRole: invitation.jobRole
    })

  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error)
    res.status(500).json({ error: "Failed to load interview" })
  }
}
// ---------------- SUBMIT INTERVIEW ----------------
export const submitInterview = async (req, res) => {
  try {
    const { token, answers } = req.body

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        jobRole: { include: { questions: true } }
      }
    })

    if (!invitation) {
      return res.status(404).json({ error: "Invalid token" })
    }

    const questions = invitation.jobRole.questions

    const candidate = await prisma.candidate.create({
      data: {
        name: "Anonymous Candidate",
        email: invitation.email,
        jobRoleId: invitation.jobRoleId
      }
    })

    const interview = await prisma.interview.create({
      data: { candidateId: candidate.id }
    })

    let totalScore = 0
    const evaluatedAnswers = []

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const userAnswer = answers[i] || ""

      const prompt = `
Return ONLY JSON:

{
  "score": number,
  "feedback": "text"
}

Question: ${q.question}
Answer: ${userAnswer}
`

      let parsed = { score: 50, feedback: "Fallback evaluation" }

      try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        console.log("RAW AI:", text)

        const cleaned = text.replace(/```json|```/g, "").trim()
        parsed = JSON.parse(cleaned)

      } catch (err) {
        console.error("AI EVAL ERROR:", err.message)
      }

      totalScore += parsed.score

      evaluatedAnswers.push({
        question: q.question,
        text: userAnswer,
        score: parsed.score,
        feedback: parsed.feedback
      })

      const iq = await prisma.interviewQuestion.create({
        data: {
          question: q.question,
          difficulty: invitation.jobRole.difficulty,
          interviewId: interview.id
        }
      })

      await prisma.answer.create({
        data: {
          text: userAnswer,
          score: parsed.score,
          feedback: parsed.feedback,
          questionId: iq.id
        }
      })
    }

    const avgScore = Math.round(totalScore / questions.length)

    // ---------------- AI SUMMARY ----------------
    let aiSummary = {
      summary: "Average performance",
      strengths: [],
      weaknesses: [],
      recommendation: "Reject",
      skills: {
        communication: 50,
        technical: 50,
        problemSolving: 50,
        clarity: 50
      }
    }

    try {
      const prompt = `
Return ONLY JSON:

{
  "summary": "text",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendation": "Hire" or "Reject",
  "skills": {
    "communication": number,
    "technical": number,
    "problemSolving": number,
    "clarity": number
  }
}

Data:
${evaluatedAnswers.map(a => `${a.question} -> ${a.text}`).join("\n")}
`

      const result = await model.generateContent(prompt)
      const text = result.response.text()

      console.log("RAW SUMMARY:", text)

      const cleaned = text.replace(/```json|```/g, "").trim()
      aiSummary = JSON.parse(cleaned)

    } catch (err) {
      console.error("AI SUMMARY ERROR:", err.message)
    }

    await prisma.report.create({
      data: {
        summary: aiSummary.summary,
        avgScore,
        interviewId: interview.id,
        strengths: aiSummary.strengths,
        weaknesses: aiSummary.weaknesses,
        recommendation: aiSummary.recommendation,
        skills: aiSummary.skills
      }
    })

    res.json({ success: true, avgScore })

  } catch (error) {
    console.error("SUBMIT ERROR:", error)
    res.status(500).json({ error: "Submission failed" })
  }
}