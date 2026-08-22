import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import { getAttendance, getEmployeeLeaves, getEmployeeSalary, activityLog } from '../../data/mockData'
import { Clock, Calendar, Wallet, TrendingUp, User, ChevronRight } from 'lucide-react'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = getAttendance(user.id, today)
  const leaves = getEmployeeLeaves(user.id)
  const salary = getEmployeeSalary(user.id)
  const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length

  const quickActions = [
    { label: 'My Profile', to: '/profile', icon: User, bg: 'bg-primary-50 text-primary' },
    { label: 'Attendance', to: '/attendance', icon: Clock, bg: 'bg-status-present/10 text-status-present' },
    { label: 'Time Off', to: '/leave', icon: Calendar, bg: 'bg-primary-container/10 text-primary-container' },
    { label: 'Payroll', to: '/payroll', icon: Wallet, bg: 'bg-secondary-container text-on-secondary-container' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-headline text-on-surface mb-2 tracking-tight">Good morning, {user.firstName}</h1>
          <p className="text-on-surface-variant text-sm md:text-base font-body">Here&apos;s what&apos;s happening today</p>
        </div>
        <p className="text-sm text-on-surface-variant font-body">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Status Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 soft-shadow">
          <span className="text-on-surface-variant text-sm font-medium mb-4 flex items-center gap-2 font-label">
            <Clock className="text-primary" /> Today&apos;s Status
          </span>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${todayAttendance?.status === 'PRESENT' ? 'status-present' : todayAttendance?.status === 'LEAVE' ? 'bg-info' : todayAttendance?.status === 'HALF_DAY' ? 'status-break' : 'bg-outline-variant'}`} />
            <span className="text-3xl font-headline font-semibold text-on-surface">
              {todayAttendance?.status === 'PRESENT' ? 'Present' : todayAttendance?.status === 'LEAVE' ? 'On Leave' : todayAttendance?.status === 'HALF_DAY' ? 'Half Day' : '—'}
            </span>
          </div>
          {todayAttendance?.checkIn && <p className="text-xs text-on-surface-variant font-label mt-2">Checked in at {todayAttendance.checkIn}</p>}
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 soft-shadow">
          <span className="text-on-surface-variant text-sm font-medium mb-4 flex items-center gap-2 font-label">
            <Calendar className="text-primary-container" /> Leave Balance
          </span>
          <div className="text-3xl font-headline font-semibold text-on-surface">{approvedLeaves}<span className="text-lg text-on-surface-variant font-body font-normal"> used</span></div>
          <p className="text-xs text-on-surface-variant font-label mt-2">{pendingLeaves} pending</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 soft-shadow">
          <span className="text-on-surface-variant text-sm font-medium mb-4 flex items-center gap-2 font-label">
            <Wallet className="text-secondary" /> Monthly Salary
          </span>
          <div className="text-3xl font-headline font-semibold text-on-surface">{'\u20B9'}{salary?.monthlyWage?.toLocaleString('en-IN') || '—'}</div>
          <p className="text-xs text-on-surface-variant font-label mt-2">Last paid on Aug 1</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 soft-shadow">
          <span className="text-on-surface-variant text-sm font-medium mb-4 flex items-center gap-2 font-label">
            <TrendingUp className="text-primary" /> This Month
          </span>
          <div className="text-3xl font-headline font-semibold text-on-surface">22<span className="text-lg text-on-surface-variant font-body font-normal"> d</span></div>
          <p className="text-xs text-on-surface-variant font-label mt-2">3 days remaining</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-headline text-on-surface mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 soft-shadow hover:border-outline-variant transition-all cursor-pointer group">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.bg}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-label font-medium text-on-surface group-hover:text-primary transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 soft-shadow">
        <div className="px-6 py-4 border-b border-outline-variant/40">
          <h3 className="text-2xl font-headline text-on-surface">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activityLog.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-outline-variant/20 last:border-0">
                <Avatar firstName={activity.employee.split(' ')[0]} lastName={activity.employee.split(' ')[1]} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-on-surface"><span className="font-medium">{activity.employee}</span> <span className="text-on-surface-variant">{activity.action}</span></p>
                  <p className="text-xs text-on-surface-variant font-label mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
