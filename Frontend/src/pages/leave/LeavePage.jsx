import { useEffect, useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { applyLeaveRequest, fetchLeaveBalance, fetchLeaveRequests } from '../../api/employee'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog'

export default function LeavePage() {
  const { user } = useAuth()
  const manager = isManager(user.role)
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [leaves, setLeaves] = useState([])
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    leaveType: 'PAID_TIME_OFF',
    startDate: '',
    endDate: '',
    remarks: '',
    attachmentUrl: '',
  })

  const load = () => {
    if (manager) return
    Promise.all([fetchLeaveRequests(), fetchLeaveBalance()])
      .then(([list, bal]) => {
        setLeaves(list || [])
        setBalance(bal)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => { load() }, [manager])

  const shown = filter ? leaves.filter((l) => l.status === filter) : leaves
  const styles = {
    PENDING: 'bg-absent/10 text-absent',
    APPROVED: 'bg-present/10 text-present',
    REJECTED: 'bg-error-container text-error',
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await applyLeaveRequest({
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        remarks: form.remarks,
        attachmentUrl: form.leaveType === 'SICK_LEAVE' ? form.attachmentUrl : form.attachmentUrl || null,
      })
      setOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (manager) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Time off</h1>
        <p className="text-sm text-ink-muted">
          Employees apply from their own Time Off page. Approve or reject with
          {' '}<code className="text-xs">PUT /api/admin/leave-requests/{'{id}'}</code>
          {' '}using status APPROVED or REJECTED. A company-wide leave inbox API is not in the current backend.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Time off</h1>
          <p className="mt-1 text-sm text-ink-muted">Balances and requests are loaded from the backend.</p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> NEW</Button>
      </div>

      {error && <Alert variant="destructive" description={error} />}

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Paid Time Off</p>
          <p className="mt-1 text-2xl font-extrabold">{balance?.paidTimeOffAvailable ?? '—'}</p>
          <p className="text-xs text-ink-muted">Days available</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Sick Time Off</p>
          <p className="mt-1 text-2xl font-extrabold">{balance?.sickLeaveAvailable ?? '—'}</p>
          <p className="text-xs text-ink-muted">Days available</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Unpaid</p>
          <p className="mt-2 text-sm text-ink-muted">{balance?.unpaidLeaveInfo || '—'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'PENDING', 'APPROVED', 'REJECTED'].map((v) => (
          <button
            key={v || 'all'}
            onClick={() => setFilter(v)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === v ? 'bg-primary text-white' : 'bg-white text-ink-muted border border-outline-variant'}`}
          >
            {v || 'All'}
          </button>
        ))}
      </div>

      <div className="card divide-y divide-outline-variant/60">
        {shown.length === 0 ? (
          <div className="py-12 text-center text-ink-muted">
            <Calendar className="mx-auto mb-2 h-8 w-8" />
            No requests
          </div>
        ) : shown.map((leave) => (
          <div key={leave.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${styles[leave.status]}`}>{leave.status}</span>
              <span className="text-xs text-ink-faint">{leave.leaveType}</span>
              <span className="text-xs text-ink-faint">{leave.numberOfDays} day(s)</span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{leave.startDate} → {leave.endDate}</p>
            {leave.remarks && <p className="text-xs text-ink-faint">{leave.remarks}</p>}
          </div>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent onClose={() => setOpen(false)} className="mx-4">
          <DialogHeader>
            <DialogTitle>Time off type request</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit}>
            <div className="space-y-3 p-6 pt-0">
              <p className="text-sm text-ink-muted">Employee: {user.firstName} {user.lastName}</p>
              <select className="input" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                <option value="PAID_TIME_OFF">Paid Time off</option>
                <option value="SICK_LEAVE">Sick Leave</option>
                <option value="UNPAID_LEAVE">Unpaid Leaves</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                <input required type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
              <textarea className="input min-h-[88px]" placeholder="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
              {form.leaveType === 'SICK_LEAVE' && (
                <input required className="input" placeholder="Sick leave certificate URL" value={form.attachmentUrl} onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })} />
              )}
            </div>
            <DialogFooter>
              <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Discard</Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
