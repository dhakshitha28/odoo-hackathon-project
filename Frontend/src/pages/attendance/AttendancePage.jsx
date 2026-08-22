import { useAuth } from '../../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { attendanceRecords, employees } from '../../data/mockData'
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function AttendancePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const today = new Date().toISOString().split('T')[0]

  const getRecordsForDate = (date) => {
    return attendanceRecords.filter(a => a.date === date)
  }

  const getEmployeeRecords = () => {
    return attendanceRecords.filter(a => a.employeeId === user.id)
  }

  const todayRecords = getRecordsForDate(today)
  const myRecords = getEmployeeRecords()
  const hasCheckedIn = todayRecords.some(a => a.employeeId === user.id && a.checkIn)

  const statusIcon = (status) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="h-4 w-4 text-success" />
      case 'ABSENT': return <XCircle className="h-4 w-4 text-destructive" />
      case 'LEAVE': return <AlertTriangle className="h-4 w-4 text-info" />
      case 'HALF_DAY': return <Clock className="h-4 w-4 text-warning" />
      default: return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Attendance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdmin ? 'View and manage employee attendance' : 'Track your daily attendance'}
        </p>
      </div>

      {/* Check In/Out for Employee */}
      {!isAdmin && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Today&apos;s Attendance</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3">
                {!hasCheckedIn ? (
                  <Button icon={Clock}>Check In</Button>
                ) : (
                  <Button variant="secondary" icon={Clock}>Check Out</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Present', count: (isAdmin ? todayRecords : myRecords).filter(a => a.status === 'PRESENT').length, icon: CheckCircle, color: 'text-success' },
          { label: 'Absent', count: (isAdmin ? todayRecords : myRecords).filter(a => a.status === 'ABSENT').length, icon: XCircle, color: 'text-destructive' },
          { label: 'On Leave', count: (isAdmin ? todayRecords : myRecords).filter(a => a.status === 'LEAVE').length, icon: AlertTriangle, color: 'text-info' },
          { label: 'Half Day', count: (isAdmin ? todayRecords : myRecords).filter(a => a.status === 'HALF_DAY').length, icon: Clock, color: 'text-warning' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>{isAdmin ? 'All Employees' : 'My'} Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Extra Hours</th>
                </tr>
              </thead>
              <tbody>
                {(isAdmin ? attendanceRecords : myRecords).slice(0, 15).map(record => {
                  const emp = employees.find(e => e.id === record.employeeId)
                  return (
                    <tr key={record.id}>
                      {isAdmin && (
                        <td className="font-medium">{emp?.firstName} {emp?.lastName}</td>
                      )}
                      <td>{new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{record.checkIn || '—'}</td>
                      <td>{record.checkOut || '—'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {statusIcon(record.status)}
                          <Badge variant={record.status === 'PRESENT' ? 'success' : record.status === 'LEAVE' ? 'info' : record.status === 'HALF_DAY' ? 'warning' : 'destructive'}>
                            {record.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td>{record.extraHours > 0 ? `+${record.extraHours}h` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
