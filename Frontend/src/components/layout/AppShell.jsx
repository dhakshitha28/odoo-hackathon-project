import { Outlet, Navigate, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Users, Clock, Calendar } from 'lucide-react'
import TopNav from './TopNav'
import CheckInBar from './CheckInBar'
import { cn } from '../../lib/utils'

const mobileLinks = [
  { to: '/dashboard', label: 'People', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/leave', label: 'Time Off', icon: Calendar },
]

export default function AppShell() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/signin" replace />
  if (user.mustChangePassword) return <Navigate to="/change-password" replace />

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <CheckInBar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-outline-variant bg-white/95 backdrop-blur md:hidden">
        {mobileLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-semibold',
                isActive ? 'text-primary' : 'text-ink-muted',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
