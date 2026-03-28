import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { jobRoleService } from '../../../services/jobRoleService'
import toast from 'react-hot-toast'

export const JobRolesList = ({ roles, onUpdate }) => {
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    difficulty_distribution: { easy: 2, medium: 2, hard: 2 }
  })
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Job title is required')
      return
    }

    setLoading(true)
    try {
      const techStack = formData.tech_stack
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      await jobRoleService.createJobRole({
        title: formData.title,
        description: formData.description,
        tech_stack: techStack,
        difficulty_distribution: formData.difficulty_distribution,
        is_active: true
      })

      toast.success('Job role created successfully!')
      setShowCreate(false)
      setFormData({ title: '', description: '', tech_stack: '', difficulty_distribution: { easy: 2, medium: 2, hard: 2 } })
      onUpdate()
    } catch (error) {
      toast.error('Failed to create job role')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (roleId, currentStatus) => {
    try {
      await jobRoleService.updateJobRole(roleId, { is_active: !currentStatus })
      toast.success(`Role ${!currentStatus ? 'activated' : 'deactivated'}`)
      onUpdate()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Job Roles</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage interview roles
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-lg shadow-primary/20"
        >
          {showCreate ? '✕ Cancel' : '+ Create Role'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Create New Job Role</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Full Stack Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the role and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB, TypeScript"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {loading ? 'Creating...' : 'Create Role'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreate(false)}
                  className="px-6 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!roles || roles.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Job Roles Yet</h3>
          <p className="text-muted-foreground">Create your first job role to start interviewing candidates</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-foreground">{role.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      role.is_active 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                    }`}>
                      {role.is_active ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{role.description}</p>
                </div>
                <button
                  onClick={() => handleToggleActive(role.id, role.is_active)}
                  className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
                >
                  {role.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>

              {role.tech_stack && role.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {role.tech_stack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
