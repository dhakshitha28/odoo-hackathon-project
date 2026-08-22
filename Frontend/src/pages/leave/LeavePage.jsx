import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Card, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog'
import Button from '../../components/ui/Button'
import { leaveRequests, employees } from '../../data/mockData'
import { Calendar, Plus, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function LeavePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const userLeaves = isAdmin ? leaveRequests : leaveRequests.filter(l => l.employeeId === user.id)
  const filteredLeaves = statusFilter ? userLeaves.filter(l => l.status === statusFilter) : userLeaves
  const pendingCount = userLeaves.filter(l => l.status === 'PENDING').length
  const approvedCount = userLeaves.filter(l => l.status === 'APPROVED').length
  const rejectedCount = userLeaves.filter(l => l.status === 'REJECTED').length

  const statusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning'
      case 'APPROVED': return 'success'
      case 'REJECTED': return 'destructive'
      default: return 'muted'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Leave Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? 'Review and manage leave requests' : 'Apply for leave and view your requests'}
          </p>
        </div>
        {!isAdmin && (
          <Button icon={Plus} onClick={() => setShowApplyModal(true)}>Apply for Leave</Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold">{rejectedCount}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${statusFilter === status ? 'bg-primary-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {/* Leave Requests */}
      <Card>
        <CardContent className="p-6">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No leave requests found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLeaves.map(leave => {
                const emp = employees.find(e => e.id === leave.employeeId)
                return (
                  <div key={leave.id} className="flex items-center gap-4 py-4 border-b border-border last:border-0">
                    {isAdmin && <Avatar firstName={emp?.firstName} lastName={emp?.lastName} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isAdmin && <p className="font-medium text-sm">{emp?.firstName} {emp?.lastName}</p>}
                        <Badge variant={statusVariant(leave.status)}>{leave.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {leave.leaveType} · {leave.startDate} to {leave.endDate}
                      </p>
                      {leave.remarks && <p className="text-xs text-muted-foreground mt-1">{leave.remarks}</p>}
                    </div>
                    {isAdmin && leave.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button variant="success" size="sm">Approve</Button>
                        <Button variant="destructive" size="sm">Reject</Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      <Dialog open={showApplyModal} onClose={() => setShowApplyModal(false)}>
        <DialogContent onClose={() => setShowApplyModal(false)}>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Leave Type</label>
              <select className="input">
                <option>PAID</option>
                <option>SICK</option>
                <option>UNPAID</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Start Date</label>
                <input type="date" className="input" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">End Date</label>
                <input type="date" className="input" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Remarks</label>
              <textarea className="input min-h-[80px]" placeholder="Reason for leave..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>Cancel</Button>
            <Button onClick={() => setShowApplyModal(false)}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
