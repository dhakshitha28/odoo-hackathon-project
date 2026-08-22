import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { fetchEmployeeAttendance } from '../../api/employee'
import { Alert } from '../../components/ui/Alert'

export default function AttendancePage() {
  const { user } = useAuth()
  const manager = isManager(user.role)
  const now = new Date()
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (manager) return
    const [year, m] = month.split('-').map(Number)
    fetchEmployeeAttendance(year, m)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [month, manager])

  const badge = {
    PRESENT: 'bg-present/10 text-present',
    ABSENT: 'bg-absent/10 text-absent',
    LEAVE: 'bg-leave/10 text-leave',
    HALF_DAY: 'bg-primary-50 text-primary',
  }

  if (manager) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Attendance</h1>
        <p className="text-sm text-ink-muted">
          Organization-wide attendance history is not exposed by the current backend. Use Check IN / Check OUT in the bar above. Employee accounts can view their own records here.
        </p>
      </div>
    )
  }

  const formatTime = (value) => (value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My attendance</h1>
          <p className="mt-1 text-sm text-ink-muted">Values come from the backend (work hours and extra hours included).</p>
        </div>
        <input type="month" className="input md:w-48" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      {error && <Alert variant="destructive" description={error} />}

      <div className="grid grid-cols-3 gap-3">
        {[
          ['Present days', data?.presentDays],
          ['Leaves', data?.leaveDays],
          ['Total working days', data?.totalWorkingDays],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
            <p className="mt-1 text-2xl font-extrabold">{value ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check in</th>
              <th>Check out</th>
              <th>Work hours</th>
              <th>Extra hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.records || []).map((record) => (
              <tr key={record.attendanceId}>
                <td>{record.date}</td>
                <td>{formatTime(record.checkInTime)}</td>
                <td>{formatTime(record.checkOutTime)}</td>
                <td>{record.workHours || '—'}</td>
                <td>{record.extraHours || '—'}</td>
                <td><span className={`badge ${badge[record.status] || 'bg-cream'}`}>{record.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
