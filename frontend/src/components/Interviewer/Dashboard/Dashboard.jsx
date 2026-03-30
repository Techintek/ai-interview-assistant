import { useEffect, useState } from "react"
import { DashboardLayout } from "./DashboardLayout"
import { apiFetch } from "@/lib/api"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [analytics, setAnalytics] = useState({
    totalInterviews: 0,
    avgScore: 0
  })
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("latest")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch("/api/reports/dashboard")
        const data = await res.json()

        setReports(data.reports || [])
        setAnalytics(data.analytics || {})
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredReports = (reports || [])
    .filter((r) =>
      r?.interview?.candidate?.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "score") return b.avgScore - a.avgScore
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  if (loading) {
    return <DashboardLayout><p>Loading...</p></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">
        Analytics
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl">
          <p className="text-muted-foreground">Total Interviews</p>
          <h2 className="text-2xl font-bold">
            {analytics.totalInterviews || 0}
          </h2>
        </div>

        <div className="bg-card p-6 rounded-xl">
          <p className="text-muted-foreground">Average Score</p>
          <h2 className="text-2xl font-bold">
            {analytics.avgScore || 0}
          </h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <input
          placeholder="Search by email..."
          className="p-2 border rounded w-full sm:max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded w-full sm:w-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="score">Top Score</option>
        </select>
      </div>

      {/* REPORTS */}
      <div className="mt-6 space-y-4">
        {filteredReports.length === 0 && (
          <p className="text-muted-foreground">No reports found</p>
        )}

        {filteredReports.map((r) => (
          <div
            key={r.id}
            onClick={() => navigate(`/reports/${r.id}`)}
            className="bg-card p-5 rounded-xl border cursor-pointer hover:bg-secondary transition"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Candidate</p>
                <p className="font-semibold break-words">
                  {r.interview?.candidate?.email}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-xl font-bold text-primary">
                  {r.avgScore}
                </p>
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Click to view full report →
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}