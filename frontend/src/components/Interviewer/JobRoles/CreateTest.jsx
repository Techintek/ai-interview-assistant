import { useState } from "react"
import { DashboardLayout } from "../Dashboard/DashboardLayout"
import { apiFetch } from "@/lib/api"

export const CreateTest = () => {

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [difficulty,setDifficulty] = useState("medium")
  const [duration,setDuration] = useState(30)

  const [questions,setQuestions] = useState([
    { question:"", answer:"" }
  ])

  const [pdf,setPdf] = useState(null)

  const addQuestion = () => {
    setQuestions([...questions,{question:"",answer:""}])
  }

  const removeQuestion = (index) => {

    const updated = questions.filter((_,i)=>i!==index)
    setQuestions(updated)

  }

  const updateQuestion = (index,field,value) => {

    const updated=[...questions]
    updated[index][field]=value
    setQuestions(updated)

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const res = await apiFetch("/api/jobrole", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          difficulty,
          duration,
          questions
        })
      })
  
      if (!res.ok) throw new Error()
  
      alert("Test created")
    } catch (err) {
      console.error(err)
    }
  }

  return (

    <DashboardLayout>

      <div className="max-w-4xl">

        <h1 className="text-3xl font-bold mb-8">
          Create Test
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Test Details */}

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Test Details
            </h2>

            <input
              placeholder="Test Title"
              value={title}
              onChange={e=>setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-secondary border border-border"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={e=>setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-secondary border border-border"
            />

            <div className="grid grid-cols-2 gap-4">

              <select
                value={difficulty}
                onChange={e=>setDifficulty(e.target.value)}
                className="p-3 rounded-lg bg-secondary border border-border"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <input
                type="number"
                value={duration}
                onChange={e=>setDuration(e.target.value)}
                className="p-3 rounded-lg bg-secondary border border-border"
              />

            </div>

          </div>

          {/* Upload PDF */}

          <div className="bg-card border border-border rounded-xl p-6">

            <h2 className="text-lg font-semibold mb-3">
              Import Questions (PDF)
            </h2>

            <input
              type="file"
              accept=".pdf"
              onChange={(e)=>setPdf(e.target.files[0])}
            />

            <p className="text-sm text-muted-foreground mt-2">
              Upload a PDF containing questions. OCR extraction will be added later.
            </p>

          </div>

          {/* Questions */}

          <div className="bg-card border border-border rounded-xl p-6 space-y-6">

            <div className="flex justify-between items-center">

              <h2 className="text-lg font-semibold">
                Questions
              </h2>

              <button
                type="button"
                onClick={addQuestion}
                className="bg-secondary px-4 py-2 rounded-lg"
              >
                + Add Question
              </button>

            </div>

            {questions.map((q,index)=>(

              <div
                key={index}
                className="border border-border rounded-lg p-4 space-y-3"
              >

                <input
                  placeholder="Question"
                  value={q.question}
                  onChange={(e)=>updateQuestion(index,"question",e.target.value)}
                  className="w-full p-3 rounded-lg bg-secondary border border-border"
                />

                <textarea
                  placeholder="Expected Answer"
                  value={q.answer}
                  onChange={(e)=>updateQuestion(index,"answer",e.target.value)}
                  className="w-full p-3 rounded-lg bg-secondary border border-border"
                />

                <button
                  type="button"
                  onClick={()=>removeQuestion(index)}
                  className="text-red-500 text-sm"
                >
                  Remove Question
                </button>

              </div>

            ))}

          </div>

          <div className="flex justify-end">

            <button className="bg-primary text-white px-6 py-3 rounded-lg">
              Create Test
            </button>

          </div>

        </form>

      </div>

    </DashboardLayout>

  )
}