const API_URL = "http://localhost:5001/api/auth"

export const authService = {
  async signInInterviewer(email, password) {
    const res = await fetch(`${API_URL}/login`, {
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

    // ✅ STORE USER OBJECT (IMPORTANT)
    if (data.token) {
      localStorage.setItem("user", JSON.stringify({ token: data.token }))
    }

    return data
  },

  async signUpInterviewer(name, email, password) {
    const res = await fetch(`${API_URL}/register`, {
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
    localStorage.removeItem("user")
  }
}