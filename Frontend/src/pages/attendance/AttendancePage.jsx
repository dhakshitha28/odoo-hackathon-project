import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import { isManager } from '../../data/mockData'
import { CheckCircle, Clock, Plane, XCircle } from 'lucide-react'

export default function AttendancePage() {
  const { user } = useAuth()
  const { attendance, team } = useHR()
  const manager = isManager(user.role)
  const [month, setMonth] = useState('')
  const rows = manager ? attendance : attendance.filter((a) => a.employeeId === user.id)
  const filtered = month ? rows.filter((r) => r.date.startsWith(month)) : rows

  const stats = useMemo(() => ({
    present: filtered.filter((r) => r.status === 'PRESENT').length,
    absent: filtered.filter((r) => r.status === 'ABSENT').length,
    leave: filtered.filter((r) => r.status === 'LEAVE').length,
    half: filtered.filter((r) => r.status === 'HALF_DAY').length,
  }), [filtered])

  const cards = [
    { label: 'Present', count: stats.present, icon: CheckCircle, color: 'text-present' },
    { label: 'Absent', count: stats.absent, icon: XCircle, color: 'text-absent' },
    { label: 'On leave', count: stats.leave, icon: Plane, color: 'text-leave' },
    { label: 'Half day', count: stats.half, icon: Clock, color: 'text-primary' },
  ]

  const badge = {
    PRESENT: 'bg-present/10 text-present',
    ABSENT: 'bg-absent/10 text-absent',
    LEAVE: 'bg-leave/10 text-leave',
    HALF_DAY: 'bg-primary-50 text-primary',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{manager ? 'Attendance' : 'My attendance'}</h1>
          <p className="mt-1 text-sm text-ink-muted">{manager ? 'Organization-wide logs' : 'Your check-in history. Use the systray to mark today.'}</p>
        </div>
        <input type="month" className="input md:w-48" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-3 p-4">
            <c.icon className={`h-5 w-5 ${c.color}`} />
            <div>
              <p className="text-2xl font-extrabold">{c.count}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {manager && <th>Employee</th>}
                <th>Date</th>
                <th>Check in</th>
                <th>Check out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => {
                const emp = team.find((e) => e.id === record.employeeId)
                return (
                  <tr key={record.id}>
                    {manager && <td className="font-medium">{emp?.firstName} {emp?.lastName}</td>}
                    <td>{new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="text-ink-muted">{record.checkIn || '—'}</td>
                    <td className="text-ink-muted">{record.checkOut || '—'}</td>
                    <td className="text-ink-muted">{record.extraHours ? `+${record.extraHours}h` : '—'}</td>
                    <td>
                      <span className={`badge ${badge[record.status]}`}>{record.status.replace('_', ' ')}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
