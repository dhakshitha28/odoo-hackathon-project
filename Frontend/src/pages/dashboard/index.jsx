import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../data/mockData'
import AdminDashboard from './AdminDashboard'
import EmployeeDashboard from './EmployeeDashboard'

export default function Dashboard() {
  const { user } = useAuth()
  return isManager(user?.role) ? <AdminDashboard /> : <EmployeeDashboard />
}
