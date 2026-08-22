import { demoAccounts, employees } from '../data/mockData'

export async function loginRequest(identifier, password) {
  const id = identifier.trim().toLowerCase()
  const account = demoAccounts.find(
    (a) => a.email.toLowerCase() === id || a.loginId.toLowerCase() === identifier.trim().toLowerCase(),
  )
  if (!account || account.password !== password) {
    throw new Error('Invalid email or password')
  }
  const user = employees.find((e) => e.email === account.email)
  return { token: 'mock-jwt-token', user: { ...user, mustChangePassword: account.mustChangePassword } }
}

export default { loginRequest }
