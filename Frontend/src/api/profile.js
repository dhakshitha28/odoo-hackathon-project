import api from '../services/api'

function getApiError(error) {
  const data = error.response?.data
  if (data?.message) return data.message
  return error.message || 'Something went wrong'
}

export async function getMyProfile() {
  try {
    const { data } = await api.get('/profile/me')
    if (!data.success) throw new Error(data.message || 'Failed to load profile')
    return data.data
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export async function updateMyProfile(payload) {
  try {
    const { data } = await api.put('/profile/me', payload)
    if (!data.success) throw new Error(data.message || 'Failed to update profile')
    return data.data
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export async function getSalaryBreakdown() {
  try {
    const { data } = await api.get('/profile/me/salary')
    if (!data.success) throw new Error(data.message || 'Failed to load salary breakdown')
    return data.data
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export default { getMyProfile, updateMyProfile, getSalaryBreakdown }
