import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "../Dashboard/DashboardLayout"
import { apiFetch } from "@/lib/api"
export const TestDetails = () => {

  const { id } = useParams()
  const [test, setTest] = useState(null)

  const fetchTest = async () => {
    try {

      const res = await apiFetch(`/api/jobrole/${id}`)

      const data = await res.json()
      setTest(data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTest()
  }, [])

  if (!test) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          {test.title}
        </h1>

        <p className="text-muted-foreground mt-2">
          {test.description}
        </p>

        <div className="mt-3 text-sm text-muted-foreground">
          {test.difficulty} • {test.duration} mins
        </div>

      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">

        {test.questions?.map((q, index) => (

          <div
            key={q.id}
            className="bg-card border border-border rounded-xl p-5"
          >

            <h3 className="font-semibold mb-2">
              Q{index + 1}. {q.question}
            </h3>

            <p className="text-sm text-muted-foreground">
              Answer: {q.answer}
            </p>

          </div>

        ))}

      </div>

    </DashboardLayout>
  )
}