import { useEffect } from 'react'
import { LogIn, LogOut } from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import { isManager } from '../../api/unwrap'
import { fetchHrDashboard } from '../../api/hrDashboard'
import { fetchEmployeeDashboard } from '../../api/employee'
import Button from '../ui/Button'

export default function CheckInBar() {
  const { user, token, persistUser } = useAuth()
  const { checkIn, checkOut } = useHR()
  const checkedIn = Boolean(user?.checkedIn)

  useEffect(() => {
    if (!user || !token) return undefined
    let cancelled = false

    const syncCheckedIn = async () => {
      try {
        let next
        if (isManager(user.role)) {
          const data = await fetchHrDashboard()
          next = data?.currentUser?.checkedIn
        } else {
          const data = await fetchEmployeeDashboard()
          next = data?.todayAttendance?.checkedIn ?? data?.attendanceCard?.checkedIn
        }
        if (cancelled || typeof next !== 'boolean' || next === Boolean(user.checkedIn)) return
        persistUser({ ...user, checkedIn: next }, token)
      } catch {
        /* keep the check-in flag from login */
      }
    }

    syncCheckedIn()
    return () => {
      cancelled = true
    }
  }, [])
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
            {checkedIn ? 'You are checked in' : 'Not checked in'}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button onClick={() => checkIn()} disabled={checkedIn} className="gap-2">
              <LogIn className="h-4 w-4" /> Check IN
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button variant="secondary" onClick={() => checkOut()} disabled={!checkedIn} className="gap-2">
              <LogOut className="h-4 w-4" /> Check OUT
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
