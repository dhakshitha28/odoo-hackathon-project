import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

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

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('token', jwt)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
