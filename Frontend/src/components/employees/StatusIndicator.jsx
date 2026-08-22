import { Plane } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function StatusIndicator({ status, className }) {
  const key = (status || 'absent').toLowerCase()

  if (key === 'leave' || key === 'on_leave') {
    return (
      <span
        title="On leave"
        className={cn('inline-flex h-8 w-8 items-center justify-center rounded-full bg-leave/10 text-leave', className)}
      >
        <Plane className="h-4 w-4" />
      </span>
    )
  }

  const color = key === 'present' ? 'bg-present' : 'bg-absent'
  const label = key === 'present' ? 'Present in office' : 'Absent (no leave applied)'

  return (
    <span title={label} className={cn('inline-flex h-8 w-8 items-center justify-center', className)}>
      <span className={cn('h-3 w-3 rounded-full ring-4 ring-white shadow-sm', color)} />
    </span>
  )
}
