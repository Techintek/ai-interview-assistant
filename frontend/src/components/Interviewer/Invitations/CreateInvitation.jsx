import { useState } from 'react'
import { motion } from 'framer-motion'
import { invitationService } from '../../../services/invitationService'
import { AnimatedButton } from '../../shared/AnimatedCard'
import toast from 'react-hot-toast'

export const CreateInvitation = ({ jobRoles, onCreated }) => {
  const [formData, setFormData] = useState({
    jobRoleId: '',
    email: '',
    expiresInDays: 7,
    maxUses: 1
  })
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const invitation = await invitationService.createInvitation(formData)
      setGeneratedLink(invitation.invitationUrl)
      toast.success('Invitation created successfully!')
      onCreated?.()
    } catch (error) {
      toast.error('Failed to create invitation')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    toast.success('Link copied to clipboard!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <h3 className="text-xl font-semibold mb-6">Create Invitation Link</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Role *
          </label>
          <select
            value={formData.jobRoleId}
            onChange={(e) => setFormData({ ...formData, jobRoleId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a role</option>
            {jobRoles.filter(r => r.is_active).map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (Optional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="candidate@example.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty for a generic link
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expires In (Days)
            </label>
            <input
              type="number"
              value={formData.expiresInDays}
              onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Uses
            </label>
            <input
              type="number"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              placeholder="1 for single use, -1 for unlimited"
            />
          </div>
        </div>

        <AnimatedButton
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Invitation Link'}
        </AnimatedButton>
      </form>

      {generatedLink && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <p className="text-sm font-medium text-green-800 mb-2">
            Invitation link generated!
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
