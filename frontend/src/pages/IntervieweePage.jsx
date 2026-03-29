import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { apiFetch } from "../lib/api" // ✅ ADD THIS

export const IntervieweePage = () => {
  const { token } = useParams()

  const [stage, setStage] = useState("loading")
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer] = useState("")
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(60)

  // ✅ Fetch interview (FIXED)
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await apiFetch(`/api/interview/${token}`)

        if (!res.ok) {
          setStage("error")
          return
        }

        const data = await res.json()

        setQuestions(data.jobRole.questions)
        setStage("ready")
      } catch (err) {
        console.error(err)
        setStage("error")
      }
    }

    fetchInterview()
  }, [token])

  // ✅ Timer
  useEffect(() => {
    if (stage === "interview" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }

    if (timeLeft === 0 && stage === "interview") {
      handleNext()
    }
  }, [timeLeft, stage])

  const startInterview = () => {
    setStage("interview")
    setTimeLeft(60)
  }

  const handleNext = async () => {
    const updated = [...answers, answer]
    setAnswers(updated)
    setAnswer("")

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setTimeLeft(60)
    } else {
      await submitInterview(updated)
    }
  }

  const submitInterview = async (finalAnswers) => {
    try {
      setStage("loading")

      const res = await apiFetch("/api/interview/submit", {
        method: "POST",
        body: JSON.stringify({
          token,
          answers: finalAnswers
        })
      })

      if (!res.ok) throw new Error()

      const data = await res.json()

      console.log("Final Score:", data.avgScore)

      setStage("completed")
    } catch (err) {
      console.error(err)
      setStage("error")
    }
  }

  // ---------------- UI ----------------

  if (stage === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading interview...</p>
      </div>
    )
  }

  if (stage === "error") {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-red-500 text-xl">Invalid or expired link</h1>
      </div>
    )
  }

  if (stage === "ready") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-card p-8 rounded-xl text-center">
          <h1 className="text-2xl mb-4">AI Interview</h1>
          <p className="mb-6">Ready to start your interview?</p>

          <button
            onClick={startInterview}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            Start Interview
          </button>
        </div>
      </div>
    )
  }

  if (stage === "completed") {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl">🎉 Interview Completed</h1>
      </div>
    )
  }

  // ---------------- INTERVIEW ----------------

  const q = questions[currentQ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-8 rounded-xl w-full max-w-2xl"
      >
        <div className="mb-4 flex justify-between text-sm">
          <span>
            Question {currentQ + 1} / {questions.length}
          </span>
          <span className="text-red-500">{timeLeft}s</span>
        </div>

        <h2 className="text-lg mb-6">{q.question}</h2>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          rows={5}
        />

        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          {currentQ === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </motion.div>
    </div>
  )
}