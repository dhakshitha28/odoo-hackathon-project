import { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import { isManager } from '../../data/mockData'
import { Avatar } from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog'

export default function LeavePage() {
  const { user } = useAuth()
  const { leaves, team, applyLeave, reviewLeave } = useHR()
  const manager = isManager(user.role)
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ leaveType: 'PAID', startDate: '', endDate: '', remarks: '' })

  const mine = manager ? leaves : leaves.filter((l) => l.employeeId === user.id)
  const shown = filter ? mine.filter((l) => l.status === filter) : mine
  const paidUsed = mine.filter((l) => l.leaveType === 'PAID' && l.status === 'APPROVED').length
  const sickUsed = mine.filter((l) => l.leaveType === 'SICK' && l.status === 'APPROVED').length

  const styles = {
    PENDING: 'bg-absent/10 text-absent',
    APPROVED: 'bg-present/10 text-present',
    REJECTED: 'bg-error-container text-error',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{manager ? 'Time off approvals' : 'Time off'}</h1>
          <p className="mt-1 text-sm text-ink-muted">{manager ? 'Approve or reject pending requests.' : 'Request leave and track balances.'}</p>
        </div>
        {!manager && (
          <Button className="gap-2" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Request time off</Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          ['Paid used', paidUsed, 'of 12'],
          ['Sick used', sickUsed, 'of 6'],
          ['Pending', mine.filter((l) => l.status === 'PENDING').length, 'requests'],
        ].map(([label, n, sub]) => (
          <div key={label} className="card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
            <p className="mt-1 text-2xl font-extrabold">{n}</p>
            <p className="text-xs text-ink-muted">{sub}</p>
          </div>
        ))}
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
        ) : shown.map((leave) => {
          const emp = team.find((e) => e.id === leave.employeeId)
          return (
            <div key={leave.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <Avatar firstName={emp?.firstName} lastName={emp?.lastName} size="sm" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {manager && <p className="font-semibold">{emp?.firstName} {emp?.lastName}</p>}
                  <span className={`badge ${styles[leave.status]}`}>{leave.status}</span>
                  <span className="text-xs text-ink-faint">{leave.leaveType}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{leave.startDate} → {leave.endDate}</p>
                {leave.remarks && <p className="text-xs text-ink-faint">{leave.remarks}</p>}
              </div>
              {manager && leave.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="success" onClick={() => reviewLeave(leave.id, 'APPROVED')}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => reviewLeave(leave.id, 'REJECTED')}>Reject</Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent onClose={() => setOpen(false)} className="mx-4">
          <DialogHeader>
            <DialogTitle>Request time off</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              applyLeave(form)
              setOpen(false)
            }}
          >
            <div className="space-y-3 p-6 pt-0">
              <select className="input" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                <option value="PAID">Paid</option>
                <option value="SICK">Sick</option>
                <option value="UNPAID">Unpaid</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                <input required type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
              <textarea className="input min-h-[88px]" placeholder="Reason" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
