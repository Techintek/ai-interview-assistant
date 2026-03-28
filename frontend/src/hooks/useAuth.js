import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { supabase } from '../services/supabaseClient'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session on mount
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session?.user) {
          const interviewer = await authService.getCurrentInterviewer()
          setUser(interviewer)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session)

        if (session?.user) {
          try {
            const interviewer = await authService.getCurrentInterviewer()
            setUser(interviewer)
          } catch (error) {
            console.error('Error getting interviewer:', error)
            setUser(null)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading }
}