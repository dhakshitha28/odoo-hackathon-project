import { useState } from 'react'
import { Card, CardContent } from '../../components/ui/Card'
import { notifications as mockNotifications } from '../../data/mockData'
import { Bell, Check, CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div>
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-6 py-4 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary-50/30' : ''}`}
                  onClick={() => markRead(n.id)}
                >
                  <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-primary-500' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-medium' : 'text-muted-foreground'}`}>{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(n.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && (
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
