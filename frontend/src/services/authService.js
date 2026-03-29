const API_BASE = import.meta.env.VITE_API_URL

export const authService = {
  async signInInterviewer(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Login failed")
    }

    // ✅ store token properly
    if (data.token) {
      localStorage.setItem("token", data.token)
    }

    return data
  },

  async signUpInterviewer(name, email, password) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Registration failed")
    }

    return data
  },

  logout() {
    localStorage.removeItem("token")
  }
}