import { useHR } from '../../context/HRContext'
import { departments } from '../../data/mockData'

export default function ReportsPage() {
  const { team } = useHR()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-ink-muted">Lightweight snapshot for the demo. Slips and exports come later.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['People', team.length],
          ['Present', team.filter((e) => e.status === 'present').length],
          ['On leave', team.filter((e) => e.status === 'leave').length],
          ['Absent', team.filter((e) => e.status === 'absent').length],
        ].map(([label, n]) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-extrabold">{n}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="mb-4 font-semibold">Department presence</h2>
        <div className="space-y-3">
          {departments.map((dept) => {
            const group = team.filter((e) => e.department === dept)
            const present = group.filter((e) => e.status === 'present').length
            const pct = group.length ? Math.round((present / group.length) * 100) : 0
            return (
              <div key={dept}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{dept}</span>
                  <span className="text-ink-muted">{present}/{group.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
