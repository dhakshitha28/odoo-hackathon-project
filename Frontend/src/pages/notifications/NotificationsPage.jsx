import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { fetchEmployeeNotifications } from '../../api/employee'
import { Alert } from '../../components/ui/Alert'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (isManager(user?.role)) return
    fetchEmployeeNotifications()
      .then((data) => setItems(data || []))
      .catch((err) => setError(err.message))
  }, [user])

  if (isManager(user?.role)) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
        <p className="text-sm text-ink-muted">Employee notification history is available on employee accounts via GET /api/employee/notifications.</p>
      </div>
    )
  }

  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-ink-muted">{unread ? `${unread} unread` : 'You are all caught up'}</p>
      </div>
      {error && <Alert variant="destructive" description={error} />}
      <div className="card divide-y divide-outline-variant/50">
        {items.length === 0 ? (
          <div className="py-12 text-center text-ink-muted"><Bell className="mx-auto mb-2 h-8 w-8" /> None yet</div>
        ) : items.map((n) => (
          <div key={n.id} className={`flex w-full items-start gap-3 px-5 py-4 ${!n.read ? 'bg-primary-50/60' : ''}`}>
            <span className={`mt-1.5 h-2 w-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
            <div>
              <p className="text-xs font-semibold text-ink-faint">{n.type}</p>
              <p className="text-sm">{n.message}</p>
              <p className="mt-1 text-xs text-ink-faint">{n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
