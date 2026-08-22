import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { createEmployee, fetchHrDashboard } from '../../api/hrDashboard'
import EmployeeCard from '../../components/employees/EmployeeCard'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  department: '',
  jobPosition: '',
  dateOfJoining: new Date().toISOString().slice(0, 10),
  employmentType: 'FULL_TIME',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  pinCode: '',
}

export default function TeamDashboard() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [open, setOpen] = useState(false)
  const [created, setCreated] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = (q = search) => {
    fetchHrDashboard(q)
      .then((data) => setEmployees(data.employees || []))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    const timer = setTimeout(() => load(search), 250)
    return () => clearTimeout(timer)
  }, [search])

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        gender: form.gender || null,
        pinCode: form.pinCode || null,
      }
      const result = await createEmployee(payload)
      setCreated(result)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user.firstName}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Your team, in flow</h1>
          <p className="mt-1 text-sm text-ink-muted">Click a card to open employee information in view-only mode.</p>
        </div>
        {user.canCreateEmployee && (
          <Button className="gap-2" onClick={() => { setCreated(null); setForm(emptyForm); setFormError(''); setOpen(true) }}>
            <Plus className="h-4 w-4" /> NEW
          </Button>
        )}
      </div>

      {error && <Alert variant="destructive" description={error} />}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input className="input pl-10" placeholder="Search employees" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent onClose={() => setOpen(false)} className="mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{created ? 'Employee created' : 'Create employee'}</DialogTitle>
          </DialogHeader>
          {created ? (
            <div className="space-y-3 p-6 pt-0">
              <p className="text-sm text-ink-muted">Credentials were emailed and logged by the backend. Temporary password is not returned in this API.</p>
              <div className="rounded-xl bg-cream p-4 text-sm">
                <p>Employee ID: {created.employeeId}</p>
                <p>Name: {created.name}</p>
                <p>Email: {created.email}</p>
                <p>Department: {created.department}</p>
                <p>Job position: {created.jobPosition}</p>
                <p>Role: {created.role}</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setOpen(false)}>Done</Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={submit}>
              {formError && <div className="px-6"><Alert variant="destructive" description={formError} /></div>}
              <div className="grid grid-cols-2 gap-3 p-6 pt-0">
                <input required className="input" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input required className="input" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <input required type="email" className="input col-span-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input required className="input col-span-2" placeholder="Phone (10 digits)" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                <input required className="input" placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                <input required className="input" placeholder="Job position" value={form.jobPosition} onChange={(e) => setForm({ ...form, jobPosition: e.target.value })} />
                <input required type="date" className="input" value={form.dateOfJoining} onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })} />
                <select className="input" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
                  <option value="FULL_TIME">Full time</option>
                  <option value="PART_TIME">Part time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERN">Intern</option>
                </select>
                <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Gender (optional)</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <input className="input" placeholder="PIN code" value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} />
                <input className="input col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <input className="input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                <input className="input col-span-2" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <DialogFooter>
                <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
