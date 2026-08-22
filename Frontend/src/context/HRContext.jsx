import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  employees as seedEmployees,
  attendanceRecords as seedAttendance,
  leaveRequests as seedLeaves,
  salaryData as seedSalary,
} from '../data/mockData'
import { useAuth } from './AuthContext'
import { generateEmployeeId, generateTempPassword } from '../lib/employeeId'
import { computeSalary } from '../lib/salary'

const HRContext = createContext(null)

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function loadTeam() {
  try {
    const extras = JSON.parse(localStorage.getItem('dayflow-profiles') || '[]')
    const map = new Map(seedEmployees.map((e) => [e.id, e]))
    extras.forEach((e) => map.set(e.id, e))
    return [...map.values()]
  } catch {
    return seedEmployees
  }
}

export function HRProvider({ children }) {
  const { user, persistUser, addAccount, activateAccount, accounts } = useAuth()
  const [team, setTeam] = useState(loadTeam)
  const [attendance, setAttendance] = useState(seedAttendance)
  const [leaves, setLeaves] = useState(seedLeaves)
  const [salaries, setSalaries] = useState(seedSalary)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const refresh = () => setTeam(loadTeam())
    window.addEventListener('dayflow-profiles-updated', refresh)
    return () => window.removeEventListener('dayflow-profiles-updated', refresh)
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 2800)
  }

  const todayRecord = attendance.find((a) => a.employeeId === user?.id && a.date === todayISO())

  const checkIn = () => {
    if (!user) return
    const date = todayISO()
    const existing = attendance.find((a) => a.employeeId === user.id && a.date === date)
    if (existing?.checkIn) {
      showToast('Already checked in today', 'info')
      return
    }
    const record = existing
      ? { ...existing, checkIn: nowTime(), status: 'PRESENT' }
      : { id: Date.now(), employeeId: user.id, date, checkIn: nowTime(), checkOut: null, status: 'PRESENT', extraHours: 0 }
    setAttendance((prev) => {
      const others = prev.filter((a) => !(a.employeeId === user.id && a.date === date))
      return [record, ...others]
    })
    setTeam((prev) => prev.map((e) => (e.id === user.id ? { ...e, status: 'present' } : e)))
    persistUser({ ...user, status: 'present' }, localStorage.getItem('token'))
    showToast('Checked in — you are present', 'success')
  }

  const checkOut = () => {
    if (!user) return
    const date = todayISO()
    const existing = attendance.find((a) => a.employeeId === user.id && a.date === date)
    if (!existing?.checkIn) {
      showToast('Check in first', 'info')
      return
    }
    if (existing.checkOut) {
      showToast('Already checked out', 'info')
      return
    }
    setAttendance((prev) =>
      prev.map((a) => (a.employeeId === user.id && a.date === date ? { ...a, checkOut: nowTime() } : a)),
    )
    showToast('Checked out for the day', 'success')
  }

  const createEmployee = (form) => {
    const loginId = generateEmployeeId(
      form.firstName,
      form.lastName,
      form.dateOfJoining,
      team.map((e) => e.loginId),
    )
    const password = generateTempPassword(loginId)
    const id = Math.max(...team.map((e) => e.id)) + 1
    const employee = {
      id,
      loginId,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || '',
      role: form.role || 'EMPLOYEE',
      department: form.department || 'Engineering',
      designation: form.designation || 'Team Member',
      dateOfJoining: form.dateOfJoining || todayISO(),
      profilePicture: null,
      status: 'absent',
      address: form.address || '',
      gender: form.gender || '',
      dateOfBirth: '',
      bloodGroup: '',
      maritalStatus: '',
      nationality: 'Indian',
      empCode: `EMP${String(id).padStart(3, '0')}`,
      education: '',
      skills: '',
    }
    setTeam((prev) => [...prev, employee])
    const extras = JSON.parse(localStorage.getItem('dayflow-profiles') || '[]')
    localStorage.setItem('dayflow-profiles', JSON.stringify([...extras, employee]))
    addAccount({ email: form.email, loginId, password, mustChangePassword: true, pending: false })
    const salary = computeSalary(Number(form.wage) || 50000)
    setSalaries((prev) => [...prev, { employeeId: id, ...salary, noOfWorkingDays: 26, workingDaysPerWeek: 5 }])
    showToast(`Created ${loginId}`, 'success')
    return { employee, password }
  }

  const updateSalary = (employeeId, wage) => {
    const next = computeSalary(wage)
    setSalaries((prev) => {
      const exists = prev.some((s) => s.employeeId === employeeId)
      if (!exists) return [...prev, { employeeId, ...next, noOfWorkingDays: 26, workingDaysPerWeek: 5 }]
      return prev.map((s) => (s.employeeId === employeeId ? { ...s, ...next } : s))
    })
  }

  const applyLeave = (payload) => {
    const request = {
      id: Date.now(),
      employeeId: user.id,
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      remarks: payload.remarks,
      status: 'PENDING',
      attachmentUrl: null,
      reviewedBy: null,
      reviewedAt: null,
    }
    setLeaves((prev) => [request, ...prev])
    showToast('Leave request submitted', 'success')
  }

  const reviewLeave = (id, status) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, reviewedBy: user.id, reviewedAt: todayISO() } : l)),
    )
    if (status === 'APPROVED') {
      const leave = leaves.find((l) => l.id === id)
      if (leave) {
        const today = todayISO()
        if (leave.startDate <= today && leave.endDate >= today) {
          setTeam((prev) => prev.map((e) => (e.id === leave.employeeId ? { ...e, status: 'leave' } : e)))
        }
      }
    }
    showToast(status === 'APPROVED' ? 'Leave approved' : 'Leave rejected', status === 'APPROVED' ? 'success' : 'info')
  }

  const addAttendance = (payload) => {
    const record = {
      id: Date.now(),
      employeeId: Number(payload.employeeId),
      date: payload.date,
      checkIn: payload.checkIn || null,
      checkOut: payload.checkOut || null,
      status: payload.status,
      extraHours: 0,
    }
    setAttendance((prev) => [record, ...prev.filter((a) => !(a.employeeId === record.employeeId && a.date === record.date))])
    showToast('Attendance saved', 'success')
  }

  const activateEmployee = (loginId) => {
    activateAccount(loginId)
    setTeam(loadTeam())
    showToast('Account activated', 'success')
  }

  const pendingSignups = accounts.filter((a) => a.pending)

  const value = useMemo(
    () => ({
      team,
      attendance,
      leaves,
      salaries,
      toast,
      todayRecord,
      pendingSignups,
      checkIn,
      checkOut,
      createEmployee,
      updateSalary,
      applyLeave,
      reviewLeave,
      addAttendance,
      activateEmployee,
      showToast,
    }),
    [team, attendance, leaves, salaries, toast, user, accounts],
  )

  return <HRContext.Provider value={value}>{children}</HRContext.Provider>
}

export function useHR() {
  return useContext(HRContext)
}
