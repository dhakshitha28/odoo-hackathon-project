import { useState } from 'react'
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'
import { Mountain, LayoutDashboard, Clock, Calendar, Bell, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

const mobileLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/leave', label: 'Time Off', icon: Calendar },
]

function MobileBottomNav() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const links = isAdmin
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/employees', label: 'Employees', icon: Calendar },
        { to: '/attendance', label: 'Attendance', icon: Clock },
      ]
    : mobileLinks

  return (
    <nav className="md:hidden bg-surface-container-lowest fixed bottom-0 w-full z-50 border-t border-outline-variant/50 flex justify-around items-center h-16 pb-safe">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center justify-center bg-primary-50 text-primary rounded-xl px-5 py-1.5 transition-transform duration-150 scale-95'
              : 'flex flex-col items-center justify-center text-on-surface-variant px-5 py-1.5 hover:bg-surface-container transition-colors rounded-xl'
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="text-xl mb-0.5" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined} />
              <span className={`text-[10px] font-label ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AppShell() {
  const { user, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/signin" replace />

  const getPageTitle = () => {
    const path = window.location.pathname
    if (path.includes('/dashboard')) return 'Dashboard'
    if (path.includes('/employees')) return 'Employees'
    if (path.includes('/profile')) return 'My Profile'
    if (path.includes('/attendance')) return 'Attendance'
    if (path.includes('/leave')) return 'Time Off'
    if (path.includes('/payroll')) return 'Payroll'
    if (path.includes('/reports')) return 'Reports'
    if (path.includes('/notifications')) return 'Notifications'
    if (path.includes('/settings')) return 'Settings'
    return 'Dashboard'
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 pb-16 md:pb-0" style={{ marginLeft: collapsed ? 68 : undefined }}>
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
