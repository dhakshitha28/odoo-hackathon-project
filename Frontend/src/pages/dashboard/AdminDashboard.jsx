import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchHrDashboard } from '../../api/hrDashboard'
import EmployeeCard from '../../components/employees/EmployeeCard'
import { Alert } from '../../components/ui/Alert'
import Button from '../../components/ui/Button'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      fetchHrDashboard(search)
        .then((data) => {
          setEmployees(data.employees || [])
          setError('')
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Human Resource Management</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Employees</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {user.companyName ? `${user.companyName} only. ` : ''}Click a card to open an employee in view-only mode.
          </p>
        </div>
        {user.canCreateEmployee && (
          <Link to="/employees">
            <Button>NEW</Button>
          </Link>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          className="input pl-10"
          placeholder="Search employees"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <Alert variant="destructive" description={error} />}
      {loading && <p className="text-sm text-ink-muted">Loading…</p>}
      {!loading && !error && employees.length === 0 && (
        <p className="py-12 text-center text-sm text-ink-muted">No employees found.</p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  )
}
