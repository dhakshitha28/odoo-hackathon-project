import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { getSalaryBreakdown } from '../../api/profile'
import { useEffect, useState } from 'react'
import { formatCurrency } from '../../lib/utils'
import { Alert } from '../../components/ui/Alert'

export default function PayrollPage() {
  const { user } = useAuth()
  const manager = isManager(user.role)
  const [breakdown, setBreakdown] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getSalaryBreakdown()
      .then(setBreakdown)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Payroll</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {manager
            ? 'Your salary breakdown from GET /api/profile/me/salary. There is no company-wide payroll list API yet.'
            : 'Read-only compensation from GET /api/profile/me/salary. Employee profile salary fields are also read-only.'}
        </p>
      </div>
      {error && <Alert variant="destructive" description={error} />}
      {breakdown && (
        <div className="card overflow-hidden">
          <table className="table">
            <tbody>
              {Object.entries(breakdown).map(([key, value]) => (
                <tr key={key}>
                  <td className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                  <td>{typeof value === 'number' ? formatCurrency(value) : String(value ?? '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/profile" className="text-sm font-semibold text-primary">Open My Profile</Link>
    </div>
  )
}
