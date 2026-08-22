import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui/Avatar'
import { notifications } from '../../data/mockData'
import { Bell, ChevronDown, LogOut, User, Settings, Mountain } from 'lucide-react'

export default function Header({ title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-40 flex justify-between items-center w-full px-4 py-3 md:px-6">
      {/* Left: Logo (mobile) */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary shrink-0">
          <Mountain className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-headline font-bold text-primary tracking-tight">HR Connect</h1>
      </div>

      {/* Center: Nav (desktop) */}
      <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        <span className="text-on-surface-variant text-sm font-label font-semibold">{title}</span>
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-primary-50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium font-label leading-none">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-on-surface-variant font-label mt-0.5">{user?.role === 'ADMIN' ? 'Admin' : user?.role === 'HR' ? 'HR' : 'Employee'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-on-surface-variant" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-dropdown py-2 z-50 animate-fade-in">
              <button
                onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm font-body text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <User className="h-4 w-4" />
                My Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setDropdownOpen(false) }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm font-body text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <div className="border-t border-outline-variant my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm font-body text-error hover:bg-error-container transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
