import { LogIn, LogOut } from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import Button from '../ui/Button'

export default function CheckInBar() {
  const { user } = useAuth()
  const { todayRecord, checkIn, checkOut } = useHR()
  const checkedIn = Boolean(todayRecord?.checkIn)
  const checkedOut = Boolean(todayRecord?.checkOut)
  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="border-b border-outline-variant/60 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <p className="text-sm font-semibold text-on-surface">{dateLabel}</p>
          <p className="text-xs text-ink-muted">
            {checkedOut
              ? `Checked out at ${todayRecord.checkOut}`
              : checkedIn
                ? `Checked in at ${todayRecord.checkIn}`
                : 'Not checked in yet'}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button onClick={checkIn} disabled={checkedIn} className="gap-2">
              <LogIn className="h-4 w-4" /> Check IN
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button variant="secondary" onClick={checkOut} disabled={!checkedIn || checkedOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Check OUT
            </Button>
          </motion.div>
        </div>
        {user?.status === 'present' && (
          <p className="text-xs font-medium text-present sm:hidden">Status is green — you are present.</p>
        )}
      </div>
    </div>
  )
}
