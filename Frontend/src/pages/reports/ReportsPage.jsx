import { useEffect, useState } from 'react'
import { fetchHrDashboard } from '../../api/hrDashboard'

export default function ReportsPage() {
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHrDashboard()
      .then((data) => setEmployees(data.employees || []))
      .catch((err) => setError(err.message))
  }, [])

  const present = employees.filter((e) => e.status === 'PRESENT').length
  const leave = employees.filter((e) => e.status === 'ON_LEAVE').length
  const absent = employees.filter((e) => e.status === 'ABSENT').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-ink-muted">Counts come from GET /api/dashboard employee statuses.</p>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['People', employees.length],
          ['Present', present],
          ['On leave', leave],
          ['Absent', absent],
        ].map(([label, n]) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-extrabold">{n}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
