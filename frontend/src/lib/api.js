import toast from "react-hot-toast"

const API_URL = import.meta.env.VITE_API_URL

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  })

  if (res.status === 401) {
    toast.error("Session expired. Please login again.")
    localStorage.removeItem("token")

    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)

    throw new Error("Session expired")
  }

  return res
}