import api from '../services/api'
import { unwrap } from './unwrap'

export function fetchEmployeeDashboard() {
  return unwrap(api.get('/employee/dashboard'))
}

export function fetchEmployeeProfile() {
  return unwrap(api.get('/employee/profile'))
}

export function updateEmployeeProfile(payload) {
  return unwrap(api.put('/employee/profile', payload))
}

export function fetchEmployeeAttendance(year, month) {
  const params = {}
  if (year) params.year = year
  if (month) params.month = month
  return unwrap(api.get('/employee/attendance', { params }))
}

export function employeeCheckIn() {
  return unwrap(api.post('/employee/attendance/check-in'))
}

export function employeeCheckOut() {
  return unwrap(api.post('/employee/attendance/check-out'))
}

export function fetchLeaveRequests() {
  return unwrap(api.get('/employee/leave-requests'))
}

export function applyLeaveRequest(payload) {
  return unwrap(api.post('/employee/leave-requests', payload))
}

export function fetchLeaveBalance() {
  return unwrap(api.get('/employee/leave-balance'))
}

export function fetchEmployeeNotifications() {
  return unwrap(api.get('/employee/notifications'))
}

export function adminReviewLeave(id, status) {
  return unwrap(api.put(`/admin/leave-requests/${id}`, { status }))
}

export function genericCheckIn() {
  return unwrap(api.post('/attendance/check-in'))
}

export function genericCheckOut() {
  return unwrap(api.post('/attendance/check-out'))
}
