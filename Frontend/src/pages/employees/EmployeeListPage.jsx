import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { employees, departments } from '../../data/mockData'
import { Search, Plus, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function EmployeeListPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  const filtered = employees.filter(emp => {
    const matchesSearch = !search || `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase()) || emp.loginId.toLowerCase().includes(search.toLowerCase())
    const matchesDept = !deptFilter || emp.department === deptFilter
    return matchesSearch && matchesDept
  })

  const statusStyles = {
    present: 'bg-success/10 text-success',
    active: 'bg-success/10 text-success',
    leave: 'bg-info/10 text-info',
    absent: 'bg-destructive/10 text-destructive',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">Employees</h1>
          <p className="mt-2 text-on-surface-variant font-body">{filtered.length} team member{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <Button className="gap-2">
            <Plus className="w-5 h-5" /> Add Employee
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary min-w-[180px]"
        >
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container">
                <th className="text-left px-6 py-3 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">Employee</th>
                <th className="text-left px-6 py-3 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-3 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">Designation</th>
                <th className="text-left px-6 py-3 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-container rounded-full flex items-center justify-center">
                        <span className="font-label font-semibold text-on-primary-container text-sm">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-label font-medium text-on-surface text-sm">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-on-surface-variant font-body">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-body text-on-surface-variant">{emp.loginId}</td>
                  <td className="px-6 py-4 text-sm font-body text-on-surface-variant">{emp.department}</td>
                  <td className="px-6 py-4 text-sm font-body text-on-surface-variant">{emp.designation}</td>
                  <td className="px-6 py-4 text-sm font-body text-on-surface-variant">
                    {new Date(emp.dateOfJoining).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-label font-semibold capitalize ${statusStyles[emp.status] || 'bg-surface-container text-on-surface-variant'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/profile/${emp.id}`} className="p-1.5 rounded-lg hover:bg-surface-container transition-colors inline-flex">
                      <ChevronRight className="h-4 w-4 text-outline" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-label text-on-surface-variant">No employees found</p>
          </div>
        )}
      </div>
    </div>
  )
}
