import { useAuth } from '../../context/AuthContext'
import EmployeeDashboard from './EmployeeDashboard'
import AdminDashboard from './AdminDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />
  }

  return <EmployeeDashboard />
}
