import toast from "react-hot-toast"

const API_URL = "http://localhost:5001"

export const apiFetch = async (url, options = {}) => {
  const user = JSON.parse(localStorage.getItem("user"))
  const token = user?.token

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  })

  // 🔥 AUTO LOGOUT
  if (res.status === 401) {
    toast.error("Session expired. Please login again.")

    localStorage.removeItem("user")

    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)

    throw new Error("Session expired")
  }

  return res
}