import { useEffect, useState } from 'react'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { fetchEmployeeById } from '../../api/hrDashboard'
import { fetchEmployeeProfile, updateEmployeeProfile } from '../../api/employee'
import { Avatar } from '../../components/ui/Avatar'
import StatusIndicator from '../../components/employees/StatusIndicator'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import AdminProfilePage from './AdminProfilePage'

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</dt>
      <dd className="mt-1 text-sm">{value || '—'}</dd>
    </div>
  )
}

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const manager = isManager(user?.role)
  const ownProfile = !id
  const [tab, setTab] = useState('basic')
  const [detail, setDetail] = useState(null)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [edit, setEdit] = useState({ phoneNumber: '', address: '', profilePictureUrl: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setError('')
    if (id) {
      fetchEmployeeById(id).then(setDetail).catch((err) => setError(err.message))
      return
    }
    if (!manager) {
      fetchEmployeeProfile()
        .then((data) => {
          setProfile(data)
          setEdit({
            phoneNumber: data.basic?.mobile || '',
            address: data.privateInfo?.residingAddress || '',
            profilePictureUrl: data.basic?.profilePictureUrl || '',
          })
        })
        .catch((err) => setError(err.message))
    }
  }, [id, manager])

  if (ownProfile && manager) {
    return <AdminProfilePage />
  }

  const saveLimited = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = await updateEmployeeProfile({
        phoneNumber: edit.phoneNumber,
        address: edit.address,
        profilePictureUrl: edit.profilePictureUrl || null,
      })
      setProfile(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (id && detail) {
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {error && <Alert variant="destructive" description={error} />}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <Avatar src={detail.profilePictureUrl} firstName={detail.firstName} lastName={detail.lastName} size="xl" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold">{detail.firstName} {detail.lastName}</h1>
                <StatusIndicator status={detail.status} />
                <span className="badge bg-cream text-ink-muted">View only</span>
              </div>
              <p className="mt-2 font-mono text-xs text-primary">{detail.loginId} · {detail.employeeId}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" />{detail.email}</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4" />{detail.phoneNumber || '—'}</span>
              </div>
              <p className="mt-2 text-sm">{detail.companyName} · {detail.role}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const basic = profile?.basic
  const tabs = [
    ['basic', 'Basic'],
    ['resume', 'Resume'],
    ['private', 'Private Info'],
    ['salary', 'Salary'],
    ['bank', 'Bank'],
    ['docs', 'Documents'],
    ['security', 'Security'],
  ]

  return (
    <div className="space-y-6">
      {error && <Alert variant="destructive" description={error} />}
      <div className="card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar src={basic?.profilePictureUrl} firstName={user.firstName} lastName={user.lastName} size="xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{basic?.name}</h1>
            <p className="mt-1 text-sm text-ink-muted">{basic?.jobPosition} · {basic?.department}</p>
            <p className="mt-2 font-mono text-xs text-primary">{basic?.employeeId}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" />{basic?.email}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4" />{basic?.mobile}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{basic?.location || '—'}</span>
            </div>
          </div>
          <Link to="/settings"><Button variant="secondary">Edit limited fields</Button></Link>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-2xl bg-cream p-1">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === key ? 'bg-white text-primary shadow-soft' : 'text-ink-muted'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {tab === 'basic' && (
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Name" value={basic?.name} />
            <Field label="Employee ID" value={basic?.employeeId} />
            <Field label="Job position" value={basic?.jobPosition} />
            <Field label="Email" value={basic?.email} />
            <Field label="Mobile" value={basic?.mobile} />
            <Field label="Company" value={basic?.company} />
            <Field label="Department" value={basic?.department} />
            <Field label="Manager" value={basic?.manager} />
            <Field label="Location" value={basic?.location} />
          </dl>
        )}
        {tab === 'resume' && (
          <dl className="grid gap-5">
            <Field label="Resume" value={profile?.resume?.resumeUrl} />
            <Field label="Skills" value={profile?.resume?.skills} />
            <Field label="Certifications" value={profile?.resume?.certifications} />
          </dl>
        )}
        {tab === 'private' && (
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Date of birth" value={profile?.privateInfo?.dateOfBirth} />
            <Field label="Address" value={profile?.privateInfo?.residingAddress} />
            <Field label="Nationality" value={profile?.privateInfo?.nationality} />
            <Field label="Personal email" value={profile?.privateInfo?.personalEmail} />
            <Field label="Gender" value={profile?.privateInfo?.gender} />
            <Field label="Marital status" value={profile?.privateInfo?.maritalStatus} />
            <Field label="Date of joining" value={profile?.privateInfo?.dateOfJoining} />
          </dl>
        )}
        {tab === 'salary' && (
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Salary" value={profile?.salaryInfo?.salary} />
            <Field label="Basic" value={profile?.salaryInfo?.basicSalary} />
            <Field label="Allowances" value={profile?.salaryInfo?.allowances} />
            <Field label="Bonus" value={profile?.salaryInfo?.bonus} />
            <Field label="Deductions" value={profile?.salaryInfo?.deductions} />
            <p className="col-span-2 text-xs text-ink-muted">Salary is read-only for employees.</p>
          </dl>
        )}
        {tab === 'bank' && (
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Account number" value={profile?.bankDetails?.accountNumber} />
            <Field label="Bank name" value={profile?.bankDetails?.bankName} />
            <Field label="IFSC" value={profile?.bankDetails?.ifscCode} />
            <Field label="PAN" value={profile?.bankDetails?.panNumber} />
            <Field label="UAN" value={profile?.bankDetails?.uanNumber} />
            <Field label="Employee code" value={profile?.bankDetails?.employeeCode} />
          </dl>
        )}
        {tab === 'docs' && (
          <ul className="space-y-2 text-sm">
            {(profile?.documents || []).length === 0 && <li className="text-ink-muted">No documents</li>}
            {(profile?.documents || []).map((doc) => (
              <li key={doc.url}><a className="text-primary" href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a></li>
            ))}
          </ul>
        )}
        {tab === 'security' && (
          <dl className="grid gap-5">
            <Field label="Login ID" value={profile?.security?.loginId} />
            <Field label="Email verified" value={profile?.security?.emailVerified ? 'Yes' : 'No'} />
          </dl>
        )}
      </div>

      {ownProfile && (
        <form className="card space-y-3 p-6" onSubmit={saveLimited}>
          <h3 className="font-semibold">Limited edit</h3>
          <input className="input" placeholder="Phone" value={edit.phoneNumber} onChange={(e) => setEdit({ ...edit, phoneNumber: e.target.value })} />
          <input className="input" placeholder="Address" value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} />
          <input className="input" placeholder="Profile picture URL" value={edit.profilePictureUrl} onChange={(e) => setEdit({ ...edit, profilePictureUrl: e.target.value })} />
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </form>
      )}
    </div>
  )
}
