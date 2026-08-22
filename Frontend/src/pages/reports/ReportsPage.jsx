import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { employees, departments } from '../../data/mockData'
import { BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">View attendance and payroll reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Attendance Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map(dept => {
                const deptEmployees = employees.filter(e => e.department === dept)
                const present = deptEmployees.filter(e => e.status === 'present').length
                const total = deptEmployees.length
                const pct = total > 0 ? Math.round((present / total) * 100) : 0
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dept}</span>
                      <span className="text-sm text-muted-foreground">{present}/{total} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Department Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departments.map(dept => {
                const count = employees.filter(e => e.department === dept).length
                const pct = Math.round((count / employees.length) * 100)
                return (
                  <div key={dept} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept}</span>
                        <span className="text-sm text-muted-foreground">{count} employees</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-primary-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Monthly Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Employees', value: employees.length },
              { label: 'Departments', value: departments.length },
              { label: 'Present Today', value: employees.filter(e => e.status === 'present').length },
              { label: 'On Leave', value: employees.filter(e => e.status === 'leave').length },
            ].map(s => (
              <div key={s.label} className="bg-muted rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
