import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import StatusIndicator from './StatusIndicator'
import { itemUp, springHover } from '../../lib/motion'

export default function EmployeeCard({ employee }) {
  const navigate = useNavigate()

  return (
    <motion.button
      type="button"
      variants={itemUp}
      {...springHover}
      onClick={() => navigate(`/employees/${employee.id}`)}
      className="group relative w-full text-left rounded-2xl border border-outline-variant/80 bg-white p-5 shadow-soft hover:border-primary/30 hover:shadow-card-hover"
    >
      <div className="absolute right-3 top-3">
        <StatusIndicator status={employee.status} />
      </div>
      <div className="flex flex-col items-center text-center pt-2">
        <Avatar firstName={employee.firstName} lastName={employee.lastName} size="lg" className="mb-3 ring-4 ring-primary-50" />
        <h3 className="font-semibold text-on-surface">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-sm text-ink-muted mt-0.5">{employee.designation}</p>
        <p className="text-xs text-ink-faint mt-1">{employee.department}</p>
        <p className="mt-3 font-mono text-[11px] tracking-wide text-primary bg-primary-50 px-2 py-1 rounded-lg">
          {employee.loginId}
        </p>
      </div>
    </motion.button>
  )
}
