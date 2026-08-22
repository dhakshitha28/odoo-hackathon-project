import api from '../services/api'

function getApiError(error) {
  const data = error.response?.data
  if (data?.message) return data.message
  if (data?.data && typeof data.data === 'object') {
    return Object.values(data.data).join(', ')
  }
  return error.message || 'Something went wrong'
}

export async function signupRequest(payload) {
  try {
    const { data } = await api.post('/auth/signup', payload)
    if (!data.success) throw new Error(data.message || 'Signup failed')
    return data
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export async function loginRequest(loginId, password) {
  try {
    const { data } = await api.post('/auth/login', { loginId, password })
    if (!data.success) throw new Error(data.message || 'Login failed')
    return data.data
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export async function verifyEmailRequest(token) {
  try {
    const { data } = await api.get('/auth/verify-email', { params: { token } })
    if (!data.success) throw new Error(data.message || 'Verification failed')
    return data.message
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export default { signupRequest, loginRequest, verifyEmailRequest }
