import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { HRProvider } from './context/HRContext'
import { isManager } from './data/mockData'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import ChangePassword from './pages/auth/ChangePassword'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/dashboard'
import TeamDashboard from './pages/dashboard/TeamDashboard'
import ProfilePage from './pages/profile/ProfilePage'
import AttendancePage from './pages/attendance/AttendancePage'
import LeavePage from './pages/leave/LeavePage'
import PayrollPage from './pages/payroll/PayrollPage'
import ReportsPage from './pages/reports/ReportsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import SettingsPage from './pages/settings/SettingsPage'
import './index.css'

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/" replace />
  if (user.mustChangePassword) return <Navigate to="/change-password" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (user?.mustChangePassword) return <Navigate to="/change-password" replace />
  return user ? <Navigate to="/dashboard" replace /> : children
}

function PasswordRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/signin" replace />
  return children
}

function ManagerRoute({ children }) {
  const { user } = useAuth()
  if (!isManager(user?.role)) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/change-password" element={<PasswordRoute><ChangePassword /></PasswordRoute>} />
      <Route path="/" element={<SignIn />} />
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<ManagerRoute><TeamDashboard /></ManagerRoute>} />
        <Route path="/employees/:id" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leave" element={<LeavePage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HRProvider>
          <AppRoutes />
        </HRProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}
