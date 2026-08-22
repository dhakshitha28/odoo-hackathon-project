import { useAuth } from '../../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { employees, salaryData } from '../../data/mockData'
import { Download } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function PayrollPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const displayData = isAdmin
    ? salaryData.map(s => ({ ...s, employee: employees.find(e => e.id === s.employeeId) }))
    : salaryData.filter(s => s.employeeId === user.id).map(s => ({ ...s, employee: user }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payroll</h2>
          <p className="text-sm text-muted-foreground mt-1">{isAdmin ? 'Manage employee salary and payroll' : 'View your salary information'}</p>
        </div>
        {isAdmin && <Button icon={Download}>Export Payroll</Button>}
      </div>

      {isAdmin ? (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Monthly Wage</th>
                    <th>Basic</th>
                    <th>HRA</th>
                    <th>PF</th>
                    <th>Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map(s => (
                    <tr key={s.employeeId}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar firstName={s.employee?.firstName} lastName={s.employee?.lastName} size="sm" />
                          <div>
                            <p className="font-medium">{s.employee?.firstName} {s.employee?.lastName}</p>
                            <p className="text-xs text-muted-foreground">{s.employee?.loginId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium">{'\u20B9'}{s.monthlyWage?.toLocaleString('en-IN')}</td>
                      <td>{'\u20B9'}{s.basic?.toLocaleString('en-IN')}</td>
                      <td>{'\u20B9'}{s.hra?.toLocaleString('en-IN')}</td>
                      <td>{'\u20B9'}{s.pf?.toLocaleString('en-IN')}</td>
                      <td>{'\u20B9'}{s.yearlyWage?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {displayData.map(s => (
            <div key={s.employeeId} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Monthly Wage', value: '\u20B9' + s.monthlyWage?.toLocaleString('en-IN') },
                  { label: 'Yearly Wage', value: '\u20B9' + s.yearlyWage?.toLocaleString('en-IN') },
                  { label: 'Working Days', value: s.noOfWorkingDays + '/month' },
                  { label: 'PF Contribution', value: '\u20B9' + s.pf?.toLocaleString('en-IN') },
                ].map(item => (
                  <Card key={item.label}>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-lg font-bold">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader><CardTitle>Salary Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead><tr><th>Component</th><th className="text-right">Amount</th></tr></thead>
                      <tbody>
                        {[
                          { name: 'Basic Salary', amount: s.basic },
                          { name: 'House Rent Allowance', amount: s.hra },
                          { name: 'Standard Allowance', amount: s.standardAllowance },
                          { name: 'Performance Bonus', amount: s.performanceBonus },
                          { name: 'Leave Travel Allowance', amount: s.leaveTravelAllowance },
                          { name: 'Provident Fund', amount: s.pf },
                          { name: 'Professional Tax', amount: s.professionalTax },
                        ].map(c => (
                          <tr key={c.name}>
                            <td className="font-medium">{c.name}</td>
                            <td className="text-right">{'\u20B9'}{c.amount?.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
