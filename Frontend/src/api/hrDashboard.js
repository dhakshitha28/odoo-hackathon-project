import api from '../services/api'
import { unwrap } from './unwrap'

export function fetchHrDashboard(search = '') {
  return unwrap(api.get('/dashboard', { params: search ? { search } : {} }))
}

export function fetchEmployeeById(id) {
  return unwrap(api.get(`/employees/${id}`))
}

export function createEmployee(payload) {
  return unwrap(api.post('/admin/employees', payload))
}
