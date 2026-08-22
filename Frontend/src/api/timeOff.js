import api from '../services/api'
import { unwrap } from './unwrap'

export function getAllTimeOff(search = '', status = '') {
  const params = {}
  if (search) params.search = search
  if (status) params.status = status
  return unwrap(api.get('/admin/time-off', { params }))
}

export function getTimeOffById(id) {
  return unwrap(api.get(`/admin/time-off/${id}`))
}

export function approveTimeOff(id) {
  return unwrap(api.put(`/admin/time-off/${id}/approve`))
}

export function rejectTimeOff(id, comment) {
  return unwrap(api.put(`/admin/time-off/${id}/reject`, comment ? { comment } : {}))
}

export function getLeaveAllocations() {
  return unwrap(api.get('/admin/time-off/allocations'))
}
