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