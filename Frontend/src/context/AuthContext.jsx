import { createContext, useContext, useMemo, useState } from 'react'
import { demoAccounts, employees as seedEmployees } from '../data/mockData'
import { generateEmployeeId } from '../lib/employeeId'

const AuthContext = createContext(null)
const ACCOUNTS_KEY = 'dayflow-accounts-v4'

function loadAccounts() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || 'null')
    if (Array.isArray(stored) && stored.length) {
      const byEmail = new Map(stored.map((a) => [a.email.toLowerCase(), a]))
      demoAccounts.forEach((demo) => {
        const existing = byEmail.get(demo.email.toLowerCase())
        if (!existing) byEmail.set(demo.email.toLowerCase(), demo)
        else byEmail.set(demo.email.toLowerCase(), { ...existing, ...demo, password: demo.password, pending: existing.pending && demo.pending })
      })
      return [...byEmail.values()]
    }
  } catch {
    /* ignore */
  }
  return demoAccounts
}

function loadExtras() {
  try {
    return JSON.parse(localStorage.getItem('dayflow-profiles') || '[]')
  } catch {
    return []
  }
}

function allLoginIds(accounts) {
  return [
    ...seedEmployees.map((e) => e.loginId),
    ...accounts.map((a) => a.loginId),
    ...loadExtras().map((e) => e.loginId),
  ].filter(Boolean)
}

function getInitialAuth() {
  const token = localStorage.getItem('token')
  const stored = localStorage.getItem('user')
  return {
    user: stored ? JSON.parse(stored) : null,
    token: token || null,
  }
}

export function AuthProvider({ children }) {
  const initial = getInitialAuth()
  const [user, setUser] = useState(initial.user)
  const [token, setToken] = useState(initial.token)
  const [accounts, setAccounts] = useState(loadAccounts)

  const persistAccounts = (next) => {
    setAccounts(next)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next))
  }

  const persistUser = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('token', jwt)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const login = (identifier, password) => {
    const id = identifier.trim().toLowerCase()
    const pass = password.trim()
    const account = accounts.find((a) => {
      const email = a.email.toLowerCase()
      const loginId = a.loginId.toLowerCase()
      return email === id || loginId === id
    })
    if (!account) {
      throw new Error('No account found. Use Login ID (OI…) or work email.')
    }
    const validPassword =
      pass === account.password ||
      pass.toLowerCase() === account.loginId.toLowerCase() ||
      pass.toLowerCase() === account.email.toLowerCase()
    if (!validPassword) {
      throw new Error(`Wrong password. First password is the Login ID: ${account.loginId}`)
    }
    if (account.pending) {
      throw new Error('Account is pending admin activation')
    }
    const extras = loadExtras()
    const profile = [...seedEmployees, ...extras].find((e) => e.email === account.email)
    if (!profile) {
      throw new Error('Employee profile is missing')
    }
    const userData = {
      ...profile,
      mustChangePassword: account.mustChangePassword,
    }
    persistUser(userData, 'mock-jwt-token')
    return userData
  }

  const registerSignup = ({ firstName, lastName, joiningYear, email, password }) => {
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered')
    }
    const date = `${joiningYear}-01-01`
    const loginId = generateEmployeeId(firstName, lastName, date, allLoginIds(accounts))
    const extras = loadExtras()
    const id = Math.max(0, ...seedEmployees.map((e) => e.id), ...extras.map((e) => e.id)) + 1
    const employee = {
      id,
      loginId,
      firstName,
      lastName,
      email,
      phone: '',
      role: 'EMPLOYEE',
      department: 'Operations',
      designation: 'Team Member',
      dateOfJoining: date,
      profilePicture: null,
      status: 'absent',
      address: '',
      gender: '',
      dateOfBirth: '',
      bloodGroup: '',
      maritalStatus: '',
      nationality: 'Indian',
      empCode: `EMP${String(id).padStart(3, '0')}`,
      education: '',
      skills: '',
      accountStatus: 'PENDING',
    }
    localStorage.setItem('dayflow-profiles', JSON.stringify([...extras, employee]))
    persistAccounts([
      ...accounts,
      { email, loginId, password, mustChangePassword: false, pending: true },
    ])
    window.dispatchEvent(new Event('dayflow-profiles-updated'))
    return { loginId, employee }
  }

  const activateAccount = (loginId) => {
    persistAccounts(accounts.map((a) => (a.loginId === loginId ? { ...a, pending: false } : a)))
    const extras = loadExtras().map((e) => (e.loginId === loginId ? { ...e, accountStatus: 'ACTIVE' } : e))
    localStorage.setItem('dayflow-profiles', JSON.stringify(extras))
    window.dispatchEvent(new Event('dayflow-profiles-updated'))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const changePassword = (current, next) => {
    const account = accounts.find((a) => a.email === user.email)
    if (!account || account.password !== current) {
      throw new Error('Current password is incorrect')
    }
    persistAccounts(accounts.map((a) =>
      a.email === user.email ? { ...a, password: next, mustChangePassword: false } : a,
    ))
    persistUser({ ...user, mustChangePassword: false }, token)
  }

  const addAccount = (account) => {
    persistAccounts([...accounts, { pending: false, ...account }])
  }

  const registerCompany = ({ companyName, logoDataUrl, name, email, phone }) => {
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered')
    }
    const parts = name.trim().split(/\s+/)
    const firstName = parts[0] || 'Admin'
    const lastName = parts.slice(1).join(' ') || 'User'
    const year = String(new Date().getFullYear())
    const loginId = generateEmployeeId(firstName, lastName, `${year}-01-01`, allLoginIds(accounts))
    const extras = loadExtras()
    const id = Math.max(0, ...seedEmployees.map((e) => e.id), ...extras.map((e) => e.id)) + 1
    const employee = {
      id,
      loginId,
      firstName,
      lastName,
      email,
      phone,
      role: 'ADMIN',
      department: 'HR',
      designation: 'Company Admin',
      dateOfJoining: `${year}-01-01`,
      profilePicture: logoDataUrl || null,
      status: 'present',
      address: '',
      gender: '',
      dateOfBirth: '',
      bloodGroup: '',
      maritalStatus: '',
      nationality: 'Indian',
      empCode: `EMP${String(id).padStart(3, '0')}`,
      education: '',
      skills: '',
      accountStatus: 'ACTIVE',
      companyName,
    }
    localStorage.setItem('dayflow-profiles', JSON.stringify([...extras, employee]))
    if (companyName) localStorage.setItem('dayflow-company', JSON.stringify({ name: companyName, logo: logoDataUrl || null }))
    persistAccounts([
      ...accounts,
      { email, loginId, password: loginId, mustChangePassword: true, pending: false },
    ])
    window.dispatchEvent(new Event('dayflow-profiles-updated'))
    return { loginId, employee }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading: false,
      accounts,
      login,
      logout,
      changePassword,
      addAccount,
      persistUser,
      registerSignup,
      registerCompany,
      activateAccount,
    }),
    [user, token, accounts],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
