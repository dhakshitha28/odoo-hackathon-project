import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { isManager } from '../api/unwrap'
import { employeeCheckIn, employeeCheckOut, genericCheckIn, genericCheckOut } from '../api/employee'

const HRContext = createContext(null)

export function HRProvider({ children }) {
  const { user, persistUser, token } = useAuth()
  const [toast, setToast] = useState(null)
  const [checkedIn, setCheckedIn] = useState(Boolean(user?.checkedIn))

  useEffect(() => {
    setCheckedIn(Boolean(user?.checkedIn))
  }, [user])

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 2800)
  }

  const checkIn = async () => {
    try {
      const result = isManager(user?.role) ? await genericCheckIn() : await employeeCheckIn()
      const nextChecked = result?.checkedIn ?? true
      setCheckedIn(nextChecked)
      persistUser({ ...user, checkedIn: nextChecked }, token)
      showToast(result?.status ? `Checked in (${result.status})` : 'Checked in', 'success')
      return result
    } catch (error) {
      showToast(error.message, 'info')
      throw error
    }
  }

  const checkOut = async () => {
    try {
      const result = isManager(user?.role) ? await genericCheckOut() : await employeeCheckOut()
      const nextChecked = result?.checkedIn ?? false
      setCheckedIn(nextChecked)
      persistUser({ ...user, checkedIn: nextChecked }, token)
      showToast('Checked out', 'success')
      return result
    } catch (error) {
      showToast(error.message, 'info')
      throw error
    }
  }

  const value = useMemo(
    () => ({
      toast,
      showToast,
      checkedIn: user?.checkedIn || checkedIn,
      checkIn,
      checkOut,
    }),
    [toast, user, checkedIn, token],
  )

  return <HRContext.Provider value={value}>{children}</HRContext.Provider>
}

export function useHR() {
  return useContext(HRContext)
}
