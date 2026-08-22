import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHR } from '../../context/HRContext'
import { isManager } from '../../data/mockData'
import { Avatar } from '../../components/ui/Avatar'
import StatusIndicator from '../../components/employees/StatusIndicator'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../lib/utils'
import { computeSalary } from '../../lib/salary'

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { team, salaries, attendance, updateSalary } = useHR()
  const viewingId = id ? Number(id) : user.id
  const profile = team.find((e) => e.id === viewingId)
  const fromCard = Boolean(id)
  const ownProfile = !id || Number(id) === user.id
  const manager = isManager(user.role)
  const [tab, setTab] = useState(fromCard && !ownProfile ? 0 : 0)
  const salary = salaries.find((s) => s.employeeId === viewingId)
  const [wage, setWage] = useState(salary?.monthlyWage || 50000)
  const computed = useMemo(() => computeSalary(wage), [wage])
  const records = attendance.filter((a) => a.employeeId === viewingId)

  if (!profile) {
    return <p className="py-16 text-center text-ink-muted">Employee not found.</p>
  }

  const tabs = fromCard && !ownProfile
    ? ['Personal', 'Job', 'Salary']
    : ['Personal', 'Job', 'Salary']

  const canEditSalary = manager && (!fromCard || ownProfile || manager)
  const salaryReadOnly = fromCard && !manager

  return (
    <div className="space-y-6">
      {fromCard && (
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to employees
        </button>
      )}

      <div className="card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar firstName={profile.firstName} lastName={profile.lastName} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold">{profile.firstName} {profile.lastName}</h1>
              <StatusIndicator status={profile.status} />
              {fromCard && <span className="badge bg-cream text-ink-muted">View only</span>}
            </div>
            <p className="mt-1 text-sm text-ink-muted">{profile.designation} · {profile.department}</p>
            <p className="mt-2 font-mono text-xs text-primary">{profile.loginId}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" />{profile.email}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4" />{profile.phone || '—'}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{profile.address || '—'}</span>
            </div>
          </div>
          {ownProfile && !fromCard && (
            <Link to="/settings"><Button variant="secondary">Edit limited fields</Button></Link>
          )}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-2xl bg-cream p-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === i ? 'bg-white text-primary shadow-soft' : 'text-ink-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {tab === 0 && (
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              ['Full name', `${profile.firstName} ${profile.lastName}`],
              ['Employee ID', profile.loginId],
              ['Email', profile.email],
              ['Phone', profile.phone],
              ['Date of birth', profile.dateOfBirth || '—'],
              ['Gender', profile.gender || '—'],
              ['Education', profile.education || '—'],
              ['Skills', profile.skills || '—'],
              ['Address', profile.address || '—'],
              ['Nationality', profile.nationality || '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === 1 && (
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              ['Department', profile.department],
              ['Designation', profile.designation],
              ['Joining date', profile.dateOfJoining],
              ['Role', profile.role],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === 2 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold">Wage type</label>
                <p className="mt-1 text-sm text-ink-muted">Fixed wage</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Monthly wage</label>
                <input
                  type="number"
                  className="input mt-1 w-40"
                  value={wage}
                  disabled={salaryReadOnly}
                  onChange={(e) => setWage(e.target.value)}
                />
              </div>
              {canEditSalary && !salaryReadOnly && (
                <Button onClick={() => updateSalary(viewingId, wage)}>Save structure</Button>
              )}
            </div>
            {!computed.withinWage && <p className="text-sm text-error">Components exceed defined wage.</p>}
            <table className="table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Computation</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Basic', '50% of wage', computed.basic],
                  ['House Rent Allowance', '50% of Basic', computed.hra],
                  ['Standard Allowance', 'Fixed 4,167', computed.standardAllowance],
                  ['Performance Bonus', '8.33% of wage', computed.performanceBonus],
                  ['Leave Travel Allowance', '8.333% of wage', computed.leaveTravelAllowance],
                  ['Fixed Allowance', 'Wage − other components', computed.fixedAllowance],
                  ['PF (12% of Basic)', 'Configurable rate', computed.pf],
                  ['Professional Tax', 'Fixed 200', computed.professionalTax],
                ].map(([name, type, amount]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td className="text-ink-muted">{type}</td>
                    <td className="text-right font-medium">{formatCurrency(amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-ink-muted">Earnings total {formatCurrency(computed.componentsTotal)} of wage {formatCurrency(computed.monthlyWage)}.</p>
            {records.length > 0 && fromCard && (
              <p className="text-xs text-ink-faint">Attendance history lives in the Attendance module.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
