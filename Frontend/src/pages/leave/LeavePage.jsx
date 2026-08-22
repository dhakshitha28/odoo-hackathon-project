import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { approveTimeOff, getAllTimeOff, getLeaveAllocations, getTimeOffById, rejectTimeOff } from '../../api/timeOff'
import { applyLeaveRequest, fetchLeaveBalance, fetchLeaveRequests } from '../../api/employee'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog'
import { Calendar, Plus } from 'lucide-react'

const TYPE_LABEL = {
  PAID_TIME_OFF: 'Paid Time Off',
  SICK_LEAVE: 'Sick Leave',
  UNPAID_LEAVE: 'Unpaid Leave',
}

const STATUS_CLASS = {
  PENDING: 'bg-absent/10 text-absent',
  APPROVED: 'bg-present/10 text-present',
  REJECTED: 'bg-error-container text-error',
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function AdminTimeOffBoard() {
  const [tab, setTab] = useState('requests')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [rows, setRows] = useState([])
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [rejectRow, setRejectRow] = useState(null)
  const [comment, setComment] = useState('')

  const loadRequests = (q = search, st = status) => {
    setLoading(true)
    setError('')
    getAllTimeOff(q, st)
      .then((data) => setRows(data || []))
      .catch((err) => setError(err.message || 'Unable to load Time Off records. Please try again.'))
      .finally(() => setLoading(false))
  }

  const loadAllocations = () => {
    setLoading(true)
    setError('')
    getLeaveAllocations()
      .then((data) => setAllocations(data || []))
      .catch((err) => setError(err.message || 'Unable to load Time Off records. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tab === 'requests') loadRequests(search, status)
      else loadAllocations()
    }, 250)
    return () => clearTimeout(timer)
  }, [tab, search, status])

  const onApprove = async (id, event) => {
    event.stopPropagation()
    try {
      const updated = await approveTimeOff(id)
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)))
    } catch (err) {
      setError(err.message)
    }
  }

  const onReject = async () => {
    try {
      const updated = await rejectTimeOff(rejectRow.id, comment)
      setRows((prev) => prev.map((row) => (row.id === rejectRow.id ? updated : row)))
      setRejectRow(null)
      setComment('')
    } catch (err) {
      setError(err.message)
    }
  }

  const openDetail = async (id) => {
    try {
      setDetail(await getTimeOffById(id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Time Off</h1>
          <p className="mt-1 text-sm text-ink-muted">Review employee requests. Approve and reject run on the server.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setTab('requests')} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === 'requests' ? 'bg-primary text-white' : 'border border-outline-variant bg-white text-ink-muted'}`}>Time Off</button>
        <button type="button" onClick={() => setTab('allocation')} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === 'allocation' ? 'bg-primary text-white' : 'border border-outline-variant bg-white text-ink-muted'}`}>Allocation</button>
      </div>

      {tab === 'requests' && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input className="input pl-10" placeholder="Search name, employee ID, type, or status" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      )}

      {error && <Alert variant="destructive" description={error} />}
      {loading && <p className="text-sm text-ink-muted">Loading…</p>}

      {tab === 'allocation' && !loading && (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Paid Time Off</th>
                <th>Sick Time Off</th>
                <th>Unpaid</th>
              </tr>
            </thead>
            <tbody>
              {allocations.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-ink-muted">No allocation records found.</td></tr>
              ) : allocations.map((row) => (
                <tr key={row.employeeId}>
                  <td className="font-medium">{row.employeeName}</td>
                  <td className="font-mono text-xs">{row.employeeId}</td>
                  <td>{row.paidTimeOffAvailable} days available</td>
                  <td>{row.sickLeaveAvailable} days available</td>
                  <td className="text-xs text-ink-muted">{row.unpaidLeaveInfo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'requests' && !loading && (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Time Off Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-ink-muted">No Time Off requests found.</td></tr>
              ) : rows.map((row) => (
                <tr key={row.id} className="cursor-pointer" onClick={() => openDetail(row.id)}>
                  <td className="font-medium">{row.employeeName}</td>
                  <td>{formatDate(row.startDate)}</td>
                  <td>{formatDate(row.endDate)}</td>
                  <td>{TYPE_LABEL[row.leaveType] || row.leaveType}</td>
                  <td><span className={`badge ${STATUS_CLASS[row.status]}`}>{row.status}</span></td>
                  <td>
                    {row.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={(e) => onApprove(row.id, e)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); setRejectRow(row) }}>Reject</Button>
                      </div>
                    ) : row.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)}>
        <DialogContent onClose={() => setDetail(null)} className="mx-4">
          <DialogHeader>
            <DialogTitle>Time Off details</DialogTitle>
          </DialogHeader>
          {detail && (
            <dl className="grid grid-cols-2 gap-4 p-6 pt-0 text-sm">
              <div><dt className="text-ink-faint">Employee</dt><dd>{detail.employeeName}</dd></div>
              <div><dt className="text-ink-faint">Employee ID</dt><dd>{detail.employeeId}</dd></div>
              <div><dt className="text-ink-faint">Type</dt><dd>{TYPE_LABEL[detail.leaveType] || detail.leaveType}</dd></div>
              <div><dt className="text-ink-faint">Status</dt><dd>{detail.status}</dd></div>
              <div><dt className="text-ink-faint">Start</dt><dd>{formatDate(detail.startDate)}</dd></div>
              <div><dt className="text-ink-faint">End</dt><dd>{formatDate(detail.endDate)}</dd></div>
              <div><dt className="text-ink-faint">Days</dt><dd>{detail.numberOfDays}</dd></div>
              <div><dt className="text-ink-faint">Created</dt><dd>{detail.createdAt ? new Date(detail.createdAt).toLocaleString('en-IN') : '—'}</dd></div>
              <div className="col-span-2"><dt className="text-ink-faint">Remarks</dt><dd>{detail.remarks || '—'}</dd></div>
              <div className="col-span-2"><dt className="text-ink-faint">Attachment</dt><dd>{detail.attachmentUrl ? <a className="text-primary" href={detail.attachmentUrl} target="_blank" rel="noreferrer">{detail.attachmentUrl}</a> : '—'}</dd></div>
              {detail.rejectionComment && <div className="col-span-2"><dt className="text-ink-faint">Rejection comment</dt><dd>{detail.rejectionComment}</dd></div>}
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(rejectRow)} onClose={() => setRejectRow(null)}>
        <DialogContent onClose={() => setRejectRow(null)} className="mx-4">
          <DialogHeader>
            <DialogTitle>Reject request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 p-6 pt-0">
            <p className="text-sm text-ink-muted">Optional comment for {rejectRow?.employeeName}.</p>
            <textarea className="input min-h-[88px]" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Reason" />
          </div>
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => setRejectRow(null)}>Cancel</Button>
            <Button variant="destructive" type="button" onClick={onReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

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
    return <AdminTimeOffBoard />
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
              <span className={`badge ${STATUS_CLASS[leave.status]}`}>{leave.status}</span>
              <span className="text-xs text-ink-faint">{TYPE_LABEL[leave.leaveType] || leave.leaveType}</span>
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
