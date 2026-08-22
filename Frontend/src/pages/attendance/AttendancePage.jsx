<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import { isManager } from '../../data/mockData'
import { getAdminAttendance } from '../../api/attendance'
import { Alert } from '../../components/ui/Alert'

function toDateInput(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function shiftDate(dateStr, days) {
  const d = new Date(`${dateStr}T12:00:00`)
  d.setDate(d.getDate() + days)
  return toDateInput(d)
}

function formatDayHeader(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`)
  const day = d.getDate()
  const rest = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  return `${day}, ${rest}`
}
=======
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { fetchEmployeeAttendance } from '../../api/employee'
import { Alert } from '../../components/ui/Alert'

export default function AttendancePage() {
  const { user } = useAuth()
  const manager = isManager(user.role)
  const now = new Date()
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (manager) return
    const [year, m] = month.split('-').map(Number)
    fetchEmployeeAttendance(year, m)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [month, manager])
>>>>>>> f6e699973d738d7499477c636974b6f222e3db5c

function formatClock(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function AdminAttendanceView() {
  const [date, setDate] = useState(toDateInput)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminAttendance(date, query)
      setRecords(data.records || [])
    } catch (err) {
      setError(err.message)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [date, query])

  useEffect(() => {
    load()
  }, [load])

  const dateLabel = useMemo(() => formatDayHeader(date), [date])

  if (manager) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Attendance</h1>
        <p className="text-sm text-ink-muted">
          Organization-wide attendance history is not exposed by the current backend. Use Check IN / Check OUT in the bar above. Employee accounts can view their own records here.
        </p>
      </div>
    )
  }

  const formatTime = (value) => (value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—')

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Attendance</h1>
        <div className="relative w-full max-w-md lg:mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            className="input w-full pl-10"
            placeholder="Search employee name or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
=======
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My attendance</h1>
          <p className="mt-1 text-sm text-ink-muted">Values come from the backend (work hours and extra hours included).</p>
>>>>>>> f6e699973d738d7499477c636974b6f222e3db5c
        </div>
      </div>

<<<<<<< HEAD
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white text-ink-muted hover:bg-cream"
          onClick={() => setDate((d) => shiftDate(d, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white text-ink-muted hover:bg-cream"
          onClick={() => setDate((d) => shiftDate(d, 1))}
          aria-label="Next day"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <label className="relative">
          <input
            type="date"
            className="input pr-10"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <span className="rounded-xl bg-cream px-4 py-2 text-sm font-semibold text-ink-muted">Day</span>
        <button
          type="button"
          className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-cream"
          onClick={() => setDate(toDateInput())}
        >
          Today
        </button>
=======
      {error && <Alert variant="destructive" description={error} />}

      <div className="grid grid-cols-3 gap-3">
        {[
          ['Present days', data?.presentDays],
          ['Leaves', data?.leaveDays],
          ['Total working days', data?.totalWorkingDays],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
            <p className="mt-1 text-2xl font-extrabold">{value ?? '—'}</p>
          </div>
        ))}
>>>>>>> f6e699973d738d7499477c636974b6f222e3db5c
      </div>

      {error && <Alert variant="destructive" description={error} />}

      <div className="card overflow-hidden">
<<<<<<< HEAD
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Emp</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra hours</th>
              </tr>
              <tr className="bg-cream/60">
                <th colSpan={5} className="text-left text-sm font-bold normal-case tracking-normal text-on-surface">
                  {dateLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-ink-muted">Loading attendance…</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-ink-muted">No employees found for this day.</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.employeeId}>
                    <td className="font-medium">{record.employeeName}</td>
                    <td className="text-ink-muted">{formatClock(record.checkInTime)}</td>
                    <td className="text-ink-muted">{formatClock(record.checkOutTime)}</td>
                    <td className="text-ink-muted">{record.workHours || '—'}</td>
                    <td className="text-ink-muted">{record.extraHours || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
=======
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check in</th>
              <th>Check out</th>
              <th>Work hours</th>
              <th>Extra hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.records || []).map((record) => (
              <tr key={record.attendanceId}>
                <td>{record.date}</td>
                <td>{formatTime(record.checkInTime)}</td>
                <td>{formatTime(record.checkOutTime)}</td>
                <td>{record.workHours || '—'}</td>
                <td>{record.extraHours || '—'}</td>
                <td><span className={`badge ${badge[record.status] || 'bg-cream'}`}>{record.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> f6e699973d738d7499477c636974b6f222e3db5c
      </div>
    </div>
  )
}

function EmployeeAttendanceView() {
  const { user } = useAuth()
  const { attendance } = useHR()
  const rows = attendance.filter((a) => a.employeeId === user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My attendance</h1>
        <p className="mt-1 text-sm text-ink-muted">Your check-in history. Use the systray to mark today.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra hours</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="text-ink-muted">{record.checkIn || '—'}</td>
                  <td className="text-ink-muted">{record.checkOut || '—'}</td>
                  <td className="text-ink-muted">{record.checkIn && record.checkOut ? calcWorkHours(record.checkIn, record.checkOut) : '—'}</td>
                  <td className="text-ink-muted">{record.extraHours ? formatDuration(record.extraHours * 60) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function calcWorkHours(checkIn, checkOut) {
  const [inH, inM] = checkIn.split(':').map(Number)
  const [outH, outM] = checkOut.split(':').map(Number)
  const minutes = (outH * 60 + outM) - (inH * 60 + inM)
  return formatDuration(Math.max(0, minutes))
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export default function AttendancePage() {
  const { user } = useAuth()
  const manager = isManager(user?.role)

  return manager ? <AdminAttendanceView /> : <EmployeeAttendanceView />
}
