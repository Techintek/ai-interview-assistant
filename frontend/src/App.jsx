import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import { LoginForm } from "./components/Interviewer/Auth/LoginForm"
import { RegisterForm } from "./components/Interviewer/Auth/RegisterForm"
import { Dashboard } from "./components/Interviewer/Dashboard/Dashboard"
import { IntervieweePage } from "./pages/IntervieweePage"
import { TestsPage } from "./components/Interviewer/JobRoles/TestsPage"
import { CandidatesPage } from "./components/Interviewer/Candidates/CandidatesPage"
import { CreateTest } from "./components/Interviewer/JobRoles/CreateTest"
import {TestDetails} from "./components/Interviewer/JobRoles/TestDetails"
import { RecruiterDashboard } from "./pages/RecruiterDashboard"
import { ReportPage } from "./pages/ReportPage"

function App() {
  return (
    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes>

        <Route path="/login" element={<LoginForm />} />

        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <TestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/:id"
          element={
            <ProtectedRoute>
              <TestDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidates"
          element={
            <ProtectedRoute>
              <CandidatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/create"
          element={
            <ProtectedRoute>
              <CreateTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />

        <Route path="/interview/:token" element={<IntervieweePage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

      </Routes>

    </BrowserRouter>
  )
}

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")

  if (!user) return <Navigate to="/login" replace />

  try {
    const parsed = JSON.parse(user)

    if (!parsed?.token) {
      throw new Error()
    }

  } catch {
    localStorage.removeItem("user")
    return <Navigate to="/login" replace />
  }

  return children
}

export default App