import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "../components/Interviewer/Dashboard/DashboardLayout"
import { apiFetch } from "../lib/api"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from "recharts"

export const ReportPage = () => {
  const { id } = useParams()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiFetch(`/api/reports/${id}`)

        if (!res.ok) throw new Error("Report not found")

        const data = await res.json()
        setReport(data)
      } catch (err) {
        console.error(err)
        setReport(null)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading report...</p>
      </DashboardLayout>
    )
  }

  if (!report) {
    return (
      <DashboardLayout>
        <p>Report not found</p>
      </DashboardLayout>
    )
  }

  const candidate = report.interview?.candidate

  // 📊 Chart data
  const chartData =
    report.interview?.questions?.map((q, i) => ({
      name: `Q${i + 1}`,
      score: q.answer?.score || 0
    })) || []

  // 🧠 Skill data
  const skillData = report.skills
    ? [
        { subject: "Communication", value: report.skills.communication },
        { subject: "Technical", value: report.skills.technical },
        { subject: "Problem Solving", value: report.skills.problemSolving },
        { subject: "Clarity", value: report.skills.clarity }
      ]
    : []

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Candidate Report</h1>

      <p className="text-muted-foreground mb-6">
        {candidate?.email}
      </p>

      {/* 🔵 SCORE + BAR CHART */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* SCORE CIRCLE */}
        <div className="bg-card border rounded-2xl p-6 flex flex-col items-center justify-center">

          <div className="relative w-32 h-32">

            <svg className="w-full h-full">
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="#2a2a2a"
                strokeWidth="10"
                fill="none"
              />

              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="none"
                strokeDasharray={339}
                strokeDashoffset={339 - (339 * report.avgScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              {report.avgScore}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            Overall Score
          </p>
        </div>

        {/* 📊 BAR CHART */}
        <div className="bg-card border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">
            Score Breakdown
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333"
                  }}
                />

                <Bar
                  dataKey="score"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🧠 AI SUMMARY */}
      <div className="bg-card border rounded-2xl p-6 mb-6">
        <h2 className="font-semibold mb-2">AI Summary</h2>

        <p className="text-muted-foreground">
          {report.summary || "No summary available"}
        </p>

        <span
          className={`inline-block mt-4 px-4 py-1 rounded ${
            report.recommendation === "Hire"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {report.recommendation || "No decision"}
        </span>
      </div>

      {/* 🔥 SKILL RADAR CHART */}
      {report.skills && (
        <div className="bg-card border rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Skill Breakdown</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" stroke="#aaa" />

                <Radar
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 🟢 STRENGTHS / 🔴 WEAKNESSES */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold text-green-500 mb-2">
            Strengths
          </h3>

          {report.strengths?.length ? (
            report.strengths.map((s, i) => (
              <p key={i}>• {s}</p>
            ))
          ) : (
            <p className="text-muted-foreground">
              No strengths detected
            </p>
          )}
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold text-red-500 mb-2">
            Weaknesses
          </h3>

          {report.weaknesses?.length ? (
            report.weaknesses.map((w, i) => (
              <p key={i}>• {w}</p>
            ))
          ) : (
            <p className="text-muted-foreground">
              No weaknesses detected
            </p>
          )}
        </div>
      </div>

      {/* 📄 QUESTIONS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          Detailed Breakdown
        </h2>

        {report.interview?.questions?.map((q, i) => (
          <div
            key={q.id}
            className="bg-card p-5 rounded-xl border"
          >
            <p className="font-semibold mb-2">
              Q{i + 1}. {q.question}
            </p>

            <p><b>Answer:</b> {q.answer?.text}</p>
            <p><b>Score:</b> {q.answer?.score}</p>

            <p className="text-muted-foreground text-sm mt-1">
              {q.answer?.feedback ||
                "AI evaluation unavailable. Basic scoring applied."}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}