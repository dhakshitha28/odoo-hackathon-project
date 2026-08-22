import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Card, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { employees, departments } from '../../data/mockData'
import { Search, Plus, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Employees</h2>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} employee{filtered.length !== 1 ? 's' : ''} total</p>
        </div>
        {isAdmin && (
          <Button icon={Plus}>Add Employee</Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Input placeholder="Search by name, email, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
            </div>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input w-auto min-w-[180px]">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar firstName={emp.firstName} lastName={emp.lastName} size="sm" />
                        <div>
                          <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-muted-foreground">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground font-mono text-xs">{emp.loginId}</td>
                    <td className="text-muted-foreground">{emp.department}</td>
                    <td className="text-muted-foreground">{emp.designation}</td>
                    <td className="text-muted-foreground">{new Date(emp.dateOfJoining).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <Badge variant={emp.status === 'present' ? 'success' : emp.status === 'leave' ? 'info' : 'destructive'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td>
                      <Link to={`/profile/${emp.id}`} className="p-1.5 rounded-md hover:bg-muted transition-colors inline-flex">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No employees found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
