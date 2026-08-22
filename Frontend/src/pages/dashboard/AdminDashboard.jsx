import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { employees, attendanceRecords, leaveRequests, activityLog, departments } from '../../data/mockData'
import { Users, Calendar, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendanceRecords.filter(a => a.date === today)
  const presentToday = todayAttendance.filter(a => a.status === 'PRESENT').length
  const absentToday = todayAttendance.filter(a => a.status === 'ABSENT').length
  const onLeaveToday = todayAttendance.filter(a => a.status === 'LEAVE').length
  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING')

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, iconBg: 'bg-primary-50 text-primary', sub: '+2 this month' },
    { label: 'Present Today', value: presentToday, icon: CheckCircle, iconBg: 'bg-status-present/10 text-status-present', sub: absentToday + ' absent' },
    { label: 'On Leave', value: onLeaveToday, icon: Calendar, iconBg: 'bg-primary-container/10 text-primary-container', sub: pendingLeaves.length + ' pending' },
    { label: 'Departments', value: departments.length, icon: TrendingUp, iconBg: 'bg-secondary-container text-on-secondary-container', sub: 'All active' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl md:text-5xl font-headline text-on-surface mb-2 tracking-tight">Good morning, {user.firstName}</h1>
        <p className="text-on-surface-variant text-sm md:text-base font-body">Here&apos;s your HR overview for today</p>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 soft-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant text-sm font-medium font-label">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-headline font-semibold text-on-surface">{stat.value}</div>
            <p className="text-xs text-on-surface-variant font-label mt-2">{stat.sub}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Leave Requests */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 soft-shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/40">
            <h3 className="text-2xl font-headline text-on-surface">Pending Leave Requests</h3>
            <Link to="/leave" className="text-primary text-sm font-label flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-status-present mx-auto mb-2" />
                <p className="text-sm text-on-surface-variant font-body">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeaves.map((leave) => {
                  const emp = employees.find(e => e.id === leave.employeeId)
                  return (
                    <div key={leave.id} className="flex items-center gap-4 py-4 border-b border-outline-variant/20 last:border-0">
                      <Avatar firstName={emp?.firstName} lastName={emp?.lastName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium font-body text-on-surface">{emp?.firstName} {emp?.lastName}</p>
                        <p className="text-xs text-on-surface-variant font-label mt-0.5">{leave.leaveType} &middot; {leave.startDate} to {leave.endDate}</p>
                      </div>
                      <span className="badge-pending">Pending</span>
                      <div className="flex gap-2">
                        <button className="h-8 px-3 rounded-lg bg-status-present text-white text-xs font-label font-medium hover:bg-status-present/90 transition-colors">Approve</button>
                        <button className="h-8 px-3 rounded-lg bg-error text-on-error text-xs font-label font-medium hover:bg-error/90 transition-colors">Reject</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 soft-shadow">
          <div className="px-6 py-4 border-b border-outline-variant/40">
            <h3 className="text-2xl font-headline text-on-surface">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activityLog.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-3 border-b border-outline-variant/20 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body"><span className="font-medium text-on-surface">{activity.employee}</span> <span className="text-on-surface-variant">{activity.action}</span></p>
                    <p className="text-xs text-on-surface-variant font-label mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Overview Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 soft-shadow">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/40">
          <h3 className="text-2xl font-headline text-on-surface">Employee Overview</h3>
          <Link to="/employees" className="text-primary text-sm font-label flex items-center gap-1 hover:underline">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 5).map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar firstName={emp.firstName} lastName={emp.lastName} size="sm" />
                      <div>
                        <p className="font-medium font-body text-on-surface">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-on-surface-variant font-label">{emp.loginId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-on-surface-variant font-body">{emp.department}</td>
                  <td className="text-on-surface-variant font-body">{emp.designation}</td>
                  <td>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label font-semibold border ${
                      emp.status === 'present' ? 'bg-surface-container text-on-surface border-outline-variant/50' :
                      emp.status === 'leave' ? 'bg-primary-50 text-primary border-primary-100/30' :
                      'bg-error-container text-on-error-container border-tertiary-fixed-dim/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'present' ? 'bg-primary' : emp.status === 'leave' ? 'bg-primary' : 'bg-tertiary'}`} />
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
