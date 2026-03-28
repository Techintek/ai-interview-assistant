import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "../Dashboard/DashboardLayout"
import { apiFetch } from "@/lib/api"

export const TestsPage = () => {

  const navigate = useNavigate()
  const [tests,setTests] = useState([])
  const handleInvite = async (testId) => {

    const email = prompt("Enter candidate email")
  
    if (!email) return
  
    try {
  
      const res = await apiFetch("/api/invite", {
        method: "POST",
        body: JSON.stringify({
          email,
          jobRoleId: testId
        })
      })
  
      const data = await res.json()
  
      alert("Invite sent successfully")
  
    } catch (err) {
      console.error(err)
    }
  }

  const fetchTests = async () => {

    try {
  
      const res = await apiFetch("/api/jobrole")
      if(!res.ok){
        throw new Error("Failed to fetch tests")
      }
  
      const data = await res.json()
  
      setTests(data)
  
    } catch(error){
  
      console.error(error)
  
    }
  
  }

    useEffect(()=>{
        fetchTests()
    },[])


  return (

    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Tests
        </h1>

        <button
          onClick={()=>navigate("/tests/create")}
          className="bg-primary text-white px-5 py-2 rounded-lg"
        >
          + Create Test
        </button>

      </div>

      <div className="grid gap-4">

        {tests.map(test => (

          <div
            key={test.id}
            className="bg-card border border-border rounded-xl p-6 flex justify-between items-center"
          >

            <div>

              <h2 className="text-xl font-semibold">
                {test.title}
              </h2>

              <p className="text-muted-foreground text-sm">
                {test.description}
              </p>

              <div className="text-sm mt-2 text-muted-foreground">
                {test.difficulty} • {test.duration} mins
              </div>

            </div>

            <div className="flex gap-3">

            <button
                onClick={() => navigate(`/tests/${test.id}`)}
                className="px-4 py-2 bg-secondary rounded-lg"
                >
                View
            </button>

              <button
                onClick={() => handleInvite(test.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                Invite
            </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )
}