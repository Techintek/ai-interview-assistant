import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { authService } from "../../../services/authService"
import toast from "react-hot-toast"

export const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      const data = await authService.signInInterviewer(email, password)

      // ✅ CLEAN STORAGE (IMPORTANT)
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          user: data.user
        })
      )

      toast.success("Login successful")

      navigate("/dashboard")

    } catch (error) {
      toast.error(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >

        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">

          <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
            Interviewer Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm text-foreground">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="interviewer@example.com"
                className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-foreground">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </p>

        </div>

      </motion.div>
    </div>
  )
}