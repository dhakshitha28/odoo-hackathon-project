import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import { isManager } from '../../data/mockData'
import { formatCurrency } from '../../lib/utils'
import { Avatar } from '../../components/ui/Avatar'

export default function PayrollPage() {
  const { user } = useAuth()
  const { salaries, team } = useHR()
  const manager = isManager(user.role)
  const rows = manager ? salaries : salaries.filter((s) => s.employeeId === user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Payroll</h1>
        <p className="mt-1 text-sm text-ink-muted">{manager ? 'Salary structures across the team. Open a profile to edit wage components.' : 'Read-only view of your compensation.'}</p>
      </div>
      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Monthly</th>
              <th>Basic</th>
              <th>HRA</th>
              <th>PF</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const emp = team.find((e) => e.id === s.employeeId)
              return (
                <tr key={s.employeeId}>
                  <td>
                    <Link to={`/employees/${s.employeeId}`} className="flex items-center gap-3 hover:text-primary">
                      <Avatar firstName={emp?.firstName} lastName={emp?.lastName} size="sm" />
                      <span className="font-medium">{emp?.firstName} {emp?.lastName}</span>
                    </Link>
                  </td>
                  <td className="font-semibold">{formatCurrency(s.monthlyWage)}</td>
                  <td className="text-ink-muted">{formatCurrency(s.basic)}</td>
                  <td className="text-ink-muted">{formatCurrency(s.hra)}</td>
                  <td className="text-ink-muted">{formatCurrency(s.pf)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
