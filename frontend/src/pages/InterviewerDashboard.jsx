import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatsCards } from '../components/Interviewer/Dashboard/StatsCards'
import { JobRolesList } from '../components/Interviewer/JobRoles/JobRolesList'
import { CandidatesList } from '../components/Interviewer/Candidates/CandidatesList'
import { InvitationManager } from '../components/Interviewer/Invitations/InvitationManager'
import { candidateService } from '../services/candidateService'
import { jobRoleService } from '../services/jobRoleService'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// Simple AnimatedCard component inline
const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
  >
    {children}
  </motion.div>
)


export const InterviewerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [jobRoles, setJobRoles] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, rolesData, candidatesData] = await Promise.all([
        candidateService.getDashboardStats(),
        jobRoleService.getJobRoles(),
        candidateService.getCandidates()
      ])

      setStats(statsData)
      setJobRoles(rolesData)
      setCandidates(candidatesData)
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      navigate('/login')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'roles', label: 'Job Roles', icon: '💼' },
    { id: 'candidates', label: 'Candidates', icon: '👥' },
    { id: 'invitations', label: 'Invitations', icon: '📧' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

 // Keep all your existing imports and logic, just update the JSX return:

return (
  <div className="min-h-screen bg-background">
    {/* Header */}
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-xl bg-card/95"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Interview Assistant
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-all font-medium"
          >
            Sign Out →
          </motion.button>
        </div>
      </div>
    </motion.header>

    {/* Navigation Tabs */}
    <div className="bg-card/50 border-b border-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative py-4 px-2 text-sm font-medium transition-colors"
            >
              <span className={activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}>
                {tab.icon} {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-lg shadow-primary/50"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StatsCards stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedCard>
                  <h3 className="text-lg font-semibold mb-4">Recent Candidates</h3>
                  {candidates.slice(0, 5).map((candidate) => (
                    <div key={candidate.id} className="py-2 border-b last:border-0">
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </div>
                  ))}
                </AnimatedCard>
                <AnimatedCard delay={0.1}>
                  <h3 className="text-lg font-semibold mb-4">Active Job Roles</h3>
                  {jobRoles.filter(r => r.is_active).slice(0, 5).map((role) => (
                    <div key={role.id} className="py-2 border-b last:border-0">
                      <p className="font-medium">{role.title}</p>
                      <p className="text-sm text-gray-500">
                        {role.tech_stack?.join(', ')}
                      </p>
                    </div>
                  ))}
                </AnimatedCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <JobRolesList 
                roles={jobRoles} 
                onUpdate={loadDashboardData} 
              />
            </motion.div>
          )}

          {activeTab === 'candidates' && (
            <motion.div
              key="candidates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CandidatesList 
                candidates={candidates}
                jobRoles={jobRoles}
              />
            </motion.div>
          )}

          {activeTab === 'invitations' && (
            <motion.div
              key="invitations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <InvitationManager 
                jobRoles={jobRoles}
                onUpdate={loadDashboardData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
