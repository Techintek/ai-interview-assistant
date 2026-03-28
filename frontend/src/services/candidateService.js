import { supabase } from './supabaseClient'

export const candidateService = {
  // Get all candidates for interviewer's job roles
  async getCandidates(filters = {}) {
    let query = supabase
      .from('candidates')
      .select(`
        *,
        job_roles(title, tech_stack),
        interview_sessions(
          id,
          current_question_index,
          total_questions,
          is_paused,
          completed_at
        )
      `)
      .order('created_at', { ascending: false })

    if (filters.jobRoleId) {
      query = query.eq('job_role_id', filters.jobRoleId)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Get candidate details with Q&A history
  async getCandidateDetails(candidateId) {
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        *,
        job_roles(*),
        interview_sessions(
          *,
          interview_qa(*)
        )
      `)
      .eq('id', candidateId)
      .single()

    if (error) throw error
    return data
  },

  // Update candidate score manually
  async updateCandidateScore(candidateId, finalScore, summary) {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        final_score: finalScore,
        summary,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', candidateId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update individual Q&A score
  async updateQAScore(qaId, manualScore, manualFeedback) {
    const { data, error } = await supabase
      .from('interview_qa')
      .update({
        manual_score: manualScore,
        manual_feedback: manualFeedback
      })
      .eq('id', qaId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get analytics for dashboard
  async getDashboardStats() {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) return null

    // Get job roles for this interviewer
    const { data: jobRoles, error: jobError } = await supabase
      .from('job_roles')
      .select('id')
      .eq('interviewer_id', user.id)

    if (jobError) throw jobError
    const jobRoleIds = jobRoles.map(r => r.id)

    // Get total candidates
    const { count: totalCandidates, error: candidateCountError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .in('job_role_id', jobRoleIds)

    if (candidateCountError) throw candidateCountError

    // Get completed interviews
    const { count: completedInterviews, error: completedError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    if (completedError) throw completedError

    // Get active job roles
    const { count: activeRoles, error: activeRolesError } = await supabase
      .from('job_roles')
      .select('*', { count: 'exact', head: true })
      .eq('interviewer_id', user.id)
      .eq('is_active', true)

    if (activeRolesError) throw activeRolesError

    // Get average score
    const { data: scores, error: scoreError } = await supabase
      .from('candidates')
      .select('final_score')
      .not('final_score', 'is', null)

    if (scoreError) throw scoreError

    const avgScore = scores?.length
      ? scores.reduce((sum, c) => sum + c.final_score, 0) / scores.length
      : 0

    return {
      totalCandidates: totalCandidates || 0,
      completedInterviews: completedInterviews || 0,
      activeRoles: activeRoles || 0,
      averageScore: avgScore.toFixed(1)
    }
  }
}