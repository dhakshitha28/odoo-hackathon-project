import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  User,
  Mountain,
} from 'lucide-react'

const employeeLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/leave', label: 'Time Off', icon: Calendar },
  { to: '/payroll', label: 'Payroll', icon: Wallet },
]

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/leave', label: 'Leave Requests', icon: Calendar },
  { to: '/payroll', label: 'Payroll', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

const bottomLinks = [
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const links = isAdmin ? adminLinks : employeeLinks

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-surface border-r border-outline-variant z-40 transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-outline-variant flex-shrink-0">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary shrink-0">
          <Mountain className="w-5 h-5" />
        </div>
        {!collapsed && (
          <h1 className="text-xl font-headline font-bold text-primary tracking-tight">HR Connect</h1>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors font-medium text-sm',
                  isActive
                    ? 'bg-primary-50 text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container',
                  collapsed && 'justify-center px-2'
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-label">{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-outline-variant py-3 px-3 space-y-1">
        {bottomLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors font-medium text-sm',
                isActive
                  ? 'bg-primary-50 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container',
                collapsed && 'justify-center px-2'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-label">{label}</span>}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors font-medium text-sm w-full text-on-surface-variant hover:bg-error-container hover:text-error',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-label">Logout</span>}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-surface-container-lowest border border-outline-variant shadow-soft flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
      >
        <ChevronLeft className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  )
}
