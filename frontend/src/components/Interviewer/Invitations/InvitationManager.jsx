import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { invitationService } from '../../../services/invitationService'
import { emailService } from '../../../services/emailServices'
import toast from 'react-hot-toast'

export const InvitationManager = ({ jobRoles, onUpdate }) => {
  const [formData, setFormData] = useState({
    jobRoleId: '',
    email: '',
    expiresInDays: 7,
    maxUses: 1
  })
  const [loading, setLoading] = useState(false)
  const [generatedInvitation, setGeneratedInvitation] = useState(null)
  const [invitations, setInvitations] = useState([])

  useEffect(() => {
    if (formData.jobRoleId) {
      loadInvitations()
    }
  }, [formData.jobRoleId])

  const loadInvitations = async () => {
    if (!formData.jobRoleId) return
    try {
      const data = await invitationService.getInvitations(formData.jobRoleId)
      setInvitations(data)
    } catch (error) {
      console.error('Failed to load invitations:', error)
    }
  }

  const handleGenerate = async () => {
    if (!formData.jobRoleId) {
      toast.error('Please select a job role')
      return
    }

    setLoading(true)
    try {
      const invitation = await invitationService.createInvitation({
        jobRoleId: formData.jobRoleId,
        email: formData.email || null,
        expiresInDays: formData.expiresInDays,
        maxUses: formData.maxUses
      })

      setGeneratedInvitation(invitation)
      toast.success('Invitation created!')
      loadInvitations()
      onUpdate()
    } catch (error) {
      toast.error('Failed to create invitation')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (generatedInvitation) {
      emailService.copyInvitationLink(generatedInvitation.token)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleSendEmail = async () => {
    if (!generatedInvitation || !formData.email) {
      toast.error('Please enter an email address')
      return
    }

    try {
      // In production, this would call your backend API
      const emailContent = `
You've been invited to take an AI-powered interview!

Interview Link: ${window.location.origin}/interview/${generatedInvitation.token}

This link is valid for ${formData.expiresInDays} days.

Good luck!
      `

      // For demo: show the email content
      console.log('Email that would be sent:', {
        to: formData.email,
        subject: `Interview Invitation - ${generatedInvitation.job_roles?.title}`,
        body: emailContent
      })

      toast.success(`Email would be sent to ${formData.email}\n(Check console for details)`, {
        duration: 5000
      })
    } catch (error) {
      toast.error('Failed to send email')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Invitations</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Generate and send interview invitations
        </p>
      </div>

      {/* Create Invitation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Generate Invitation Link</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Job Role *
            </label>
            <select
              value={formData.jobRoleId}
              onChange={(e) => setFormData({ ...formData, jobRoleId: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Choose a role...</option>
              {jobRoles?.filter(r => r.is_active).map(role => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Candidate Email (Optional)
            </label>
            <input
              type="email"
              placeholder="candidate@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for a generic link that anyone can use
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Expires In (Days)
              </label>
              <input
                type="number"
                value={formData.expiresInDays}
                onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })}
                min="1"
                max="90"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Uses
              </label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                min="1"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading || !formData.jobRoleId}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {loading ? 'Generating...' : '✨ Generate Invitation Link'}
          </motion.button>
        </div>
      </motion.div>

      {/* Generated Invitation Display */}
      <AnimatePresence>
        {generatedInvitation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground">🎉 Invitation Created!</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {generatedInvitation.job_roles?.title}
                </p>
              </div>
              <button
                onClick={() => setGeneratedInvitation(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="bg-card/50 backdrop-blur-xl rounded-xl p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-2">Invitation Link:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-primary font-mono overflow-x-auto">
                  {generatedInvitation.invitationUrl}
                </code>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium whitespace-nowrap"
                >
                  📋 Copy
                </motion.button>
              </div>
            </div>

            {formData.email && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendEmail}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg"
              >
                📧 Send Email to {formData.email}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Invitations */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Invitations</h3>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No invitations yet. Generate one above!
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {inv.email || 'Generic Link'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inv.current_uses}/{inv.max_uses === -1 ? '∞' : inv.max_uses} uses • 
                    Expires {new Date(inv.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    emailService.copyInvitationLink(inv.token)
                    toast.success('Link copied!')
                  }}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                >
                  Copy Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
