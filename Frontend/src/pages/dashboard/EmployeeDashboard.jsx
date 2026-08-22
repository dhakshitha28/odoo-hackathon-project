import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchEmployeeDashboard } from '../../api/employee'
import { Avatar } from '../../components/ui/Avatar'
import { Alert } from '../../components/ui/Alert'
import { timeAgo } from '../../lib/utils'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmployeeDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  const attendance = data?.todayAttendance || data?.attendanceCard
  const notifications = data?.notifications || []

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-headline tracking-tight">Good morning, {data?.name || user.firstName}</h1>
        <p className="mt-1 text-sm text-ink-muted">{data?.jobPosition} · {data?.department || data?.company}</p>
      </div>

      {error && <Alert variant="destructive" description={error} />}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link to="/profile" className="card p-5 hover:border-primary/40">
          <div className="mb-3 flex items-center gap-3">
            <Avatar src={data?.profilePictureUrl} firstName={user.firstName} lastName={user.lastName} size="lg" />
            <div>
              <p className="font-semibold">{data?.name}</p>
              <p className="text-xs text-ink-muted">{data?.employeeId}</p>
            </div>
          </div>
          <p className="text-sm text-ink-muted">{data?.email}</p>
          <p className="text-sm text-ink-muted">{data?.mobile}</p>
          <p className="mt-3 text-xs font-semibold text-primary">My Profile</p>
        </Link>

        <Link to="/attendance" className="card p-5 hover:border-primary/40">
          <Clock className="mb-3 h-5 w-5 text-primary" />
          <p className="text-sm text-ink-muted">Today&apos;s attendance</p>
          <p className="mt-1 text-2xl font-extrabold">{attendance?.status || '—'}</p>
          <p className="mt-2 text-xs text-ink-muted">In {attendance?.checkInTime ? new Date(attendance.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'} · Hours {attendance?.workingHours || '—'}</p>
        </Link>

        <Link to="/leave" className="card p-5 hover:border-primary/40">
          <Calendar className="mb-3 h-5 w-5 text-primary" />
          <p className="text-sm text-ink-muted">Pending leave</p>
          <p className="mt-1 text-2xl font-extrabold">{data?.pendingLeaveCount ?? 0}</p>
          <p className="mt-2 text-xs font-semibold text-primary">Time off</p>
        </Link>
      </section>

      <section className="card">
        <div className="border-b border-outline-variant px-6 py-4">
          <h3 className="text-xl font-headline">Recent activity</h3>
        </div>
        <div className="divide-y divide-outline-variant/50">
          {notifications.length === 0 ? (
            <p className="p-6 text-sm text-ink-muted">No notifications yet.</p>
          ) : notifications.map((item) => (
            <div key={item.id} className="flex items-start gap-3 px-6 py-4">
              <User className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm">{item.message}</p>
                <p className="mt-1 text-xs text-ink-faint">{item.createdAt ? timeAgo(item.createdAt) : item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
