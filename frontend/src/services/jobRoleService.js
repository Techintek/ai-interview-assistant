import { supabase } from './supabaseClient'

export const jobRoleService = {
  // Create a new job role
  async createJobRole(roleData) {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('job_roles')
      .insert([{
        interviewer_id: user.id,
        ...roleData
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get all job roles for interviewer
  async getJobRoles() {
    const { data, error } = await supabase
      .from('job_roles')
      .select(`
        *,
        invitations(count),
        candidates(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get single job role
  async getJobRole(id) {
    const { data, error } = await supabase
      .from('job_roles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Update job role
  async updateJobRole(id, updates) {
    const { data, error } = await supabase
      .from('job_roles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete job role
  async deleteJobRole(id) {
    const { error } = await supabase
      .from('job_roles')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}