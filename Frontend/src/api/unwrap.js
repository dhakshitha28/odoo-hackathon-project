export function getApiError(error) {
  const data = error.response?.data
  if (data?.message) return data.message
  if (data?.data && typeof data.data === 'object') {
    return Object.values(data.data).join(', ')
  }
  return error.message || 'Something went wrong'
}

export async function unwrap(promise) {
  try {
    const { data } = await promise
    if (!data.success) throw new Error(data.message || 'Request failed')
    return data.data
  } catch (error) {
    throw new Error(getApiError(error))
  }
}

export function isManager(role) {
  return role === 'ADMIN' || role === 'HR'
}
