import { useState } from 'react'
import { notifications as seed } from '../../data/mockData'
import { Bell, CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  const [items, setItems] = useState(seed)
  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-ink-muted">{unread ? `${unread} unread` : 'You are all caught up'}</p>
        </div>
        {unread > 0 && (
          <button type="button" className="btn-ghost text-sm" onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>
      <div className="card divide-y divide-outline-variant/50">
        {items.length === 0 ? (
          <div className="py-12 text-center text-ink-muted"><Bell className="mx-auto mb-2 h-8 w-8" /> None yet</div>
        ) : items.map((n) => (
          <button key={n.id} type="button" className={`flex w-full items-start gap-3 px-5 py-4 text-left ${!n.read ? 'bg-primary-50/60' : ''}`} onClick={() => setItems((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}>
            <span className={`mt-1.5 h-2 w-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
            <div>
              <p className="text-sm">{n.message}</p>
              <p className="mt-1 text-xs text-ink-faint">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
