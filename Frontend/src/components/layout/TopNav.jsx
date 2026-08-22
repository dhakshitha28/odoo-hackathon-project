import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import { Avatar } from '../ui/Avatar'
import Logo from '../brand/Logo'
import { isManager } from '../../api/unwrap'
import { cn } from '../../lib/utils'

const links = [
  { to: '/dashboard', label: 'Employees' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/leave', label: 'Time Off' },
]

export default function TopNav() {
  const { user, logout } = useAuth()
  const { toast } = useHR()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const unread = 0

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/70 bg-white/80 backdrop-blur-xl">
      {toast && (
        <div className={cn('px-4 py-2 text-center text-sm font-medium text-white', toast.type === 'success' ? 'bg-present' : 'bg-primary')}>
          {toast.message}
        </div>
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-2.5">
          {user?.companyLogoUrl ? (
            <img src={user.companyLogoUrl} alt="" className="h-9 w-9 rounded-xl object-cover" />
          ) : (
            <Logo className="h-9 w-9" />
          )}
          <div className="text-left">
            <p className="text-base font-extrabold tracking-tight text-primary">Dayflow</p>
            <p className="hidden text-[11px] text-ink-faint sm:block">Every workday, aligned.</p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 rounded-full bg-cream p-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'bg-white text-primary shadow-soft' : 'text-ink-muted hover:text-on-surface',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isManager(user?.role) && (
            <>
              <NavLink
                to="/payroll"
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'bg-white text-primary shadow-soft' : 'text-ink-muted hover:text-on-surface',
                  )
                }
              >
                Payroll
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'bg-white text-primary shadow-soft' : 'text-ink-muted hover:text-on-surface',
                  )
                }
              >
                Reports
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary-50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-cream"
            >
              <span className="relative">
                <Avatar src={user?.profilePicture} firstName={user?.firstName} lastName={user?.lastName} size="sm" />
                <span
                  title={user?.checkedIn ? 'Checked in' : 'Not checked in'}
                  className={cn(
                    'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white',
                    user?.checkedIn ? 'bg-present' : 'bg-error',
                  )}
                />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-none">{user?.firstName}</span>
                <span className="mt-0.5 block text-[11px] text-ink-muted">{user?.role}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-ink-faint" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-outline-variant bg-white py-1 shadow-dropdown">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream"
                  onClick={() => { navigate('/profile'); setOpen(false) }}
                >
                  <User className="h-4 w-4" /> My Profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error-container"
                  onClick={() => { logout(); navigate('/signin') }}
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
