import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

export const RecruiterDashboard = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
        const res = await apiFetch("/api/reports")
        const data = await res.json()
        setReports(data)
        setLoading(false)
    }

    fetchReports()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Recruiter Dashboard</h1>

      {/* LIST */}
      <div className="grid gap-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setSelected(r)}
          >
            <p><b>Email:</b> {r.interview.candidate.email}</p>
            <p><b>Score:</b> {r.avgScore}</p>
          </div>
        ))}
      </div>

      {/* DETAILS */}
      {selected && (
        <div className="mt-8 p-6 border rounded bg-gray-50">
          <h2 className="text-xl mb-4">Report Details</h2>

          {selected.interview.questions.map((q, i) => (
            <div key={q.id} className="mb-4">
              <p><b>Q{i + 1}:</b> {q.question}</p>
              <p><b>Answer:</b> {q.answer?.text}</p>
              <p><b>Score:</b> {q.answer?.score}</p>
              <p><b>Feedback:</b> {q.answer?.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}