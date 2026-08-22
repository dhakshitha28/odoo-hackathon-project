import api from '../services/api'

function getApiError(error) {
  const data = error.response?.data
  if (data?.message) return data.message
  return error.message || 'Something went wrong'
}

export async function getAdminAttendance(date, search = '') {
  try {
    const { data } = await api.get('/admin/attendance', {
      params: { date, search: search || undefined },
    })
    if (!data.success) throw new Error(data.message || 'Failed to load attendance')
    return data.data
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export default { getAdminAttendance }
