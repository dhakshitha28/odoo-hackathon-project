import { createContext, useContext, useMemo, useState } from 'react'
import { demoAccounts, employees as seedEmployees } from '../data/mockData'
import { generateEmployeeId } from '../lib/employeeId'
import { loginRequest, signupRequest } from '../api/auth'

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

export function mapAuthToUser(authData, extra = {}) {
  return {
    id: extra.id || authData.loginId,
    loginId: authData.loginId,
    email: authData.email,
    role: authData.role,
    companyName: authData.companyName,
    emailVerified: authData.emailVerified ?? true,
    firstName: extra.firstName || 'User',
    lastName: extra.lastName || '',
    phone: extra.phone || extra.phoneNumber || '',
    employeeId: extra.employeeId || '',
    mustChangePassword: false,
    status: 'present',
    department: authData.role === 'EMPLOYEE' ? 'Operations' : 'HR',
    designation:
      authData.role === 'ADMIN' ? 'Company Admin' : authData.role === 'HR' ? 'HR Officer' : 'Team Member',
    dateOfJoining: extra.dateOfJoining || new Date().toISOString().slice(0, 10),
    profilePicture: extra.logoUrl || null,
    address: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    maritalStatus: '',
    nationality: 'Indian',
    empCode: extra.employeeId || '',
    education: '',
    skills: '',
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

  const login = async (loginId, password) => {
    const authData = await loginRequest(loginId.trim(), password)
    const userData = mapAuthToUser(authData)
    persistUser(userData, authData.token)
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
    const account = accounts.find((a) => a.email === user?.email)
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

  const registerCompany = async ({
    companyName,
    logoUrl,
    firstName,
    lastName,
    email,
    phoneNumber,
    employeeId,
    password,
    confirmPassword,
    role,
  }) => {
    const response = await signupRequest({
      companyName,
      logoUrl: logoUrl || null,
      firstName,
      lastName,
      email,
      phoneNumber,
      employeeId,
      password,
      confirmPassword,
      role,
    })

    const signupData = response.data
    if (companyName) {
      localStorage.setItem('dayflow-company', JSON.stringify({ name: companyName, logo: logoUrl || null }))
    }

    return {
      loginId: signupData.loginId,
      email: signupData.email,
      role: signupData.role,
      companyName: signupData.companyName,
      message: response.message,
    }
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
