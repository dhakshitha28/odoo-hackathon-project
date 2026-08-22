import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import { getMyProfile, updateMyProfile } from '../../api/profile'
import { Avatar } from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { formatCurrency } from '../../lib/utils'
import { computeSalary } from '../../lib/salary'

const TABS = ['Resume', 'Private Info', 'Salary Info']

function EditableBlock({ title, value, onSave, multiline = true }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(value || '')
  }, [value])

  const save = async () => {
    setSaving(true)
    try {
      await onSave(draft)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{title}</h3>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="text-ink-faint hover:text-primary" aria-label={`Edit ${title}`}>
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-3">
          {multiline ? (
            <textarea className="input min-h-[120px] w-full" value={draft} onChange={(e) => setDraft(e.target.value)} />
          ) : (
            <input className="input w-full" value={draft} onChange={(e) => setDraft(e.target.value)} />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            <Button size="sm" variant="secondary" onClick={() => { setDraft(value || ''); setEditing(false) }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-on-surface whitespace-pre-wrap">{value || 'Not set yet. Click the pencil to add.'}</p>
      )}
    </div>
  )
}

function ListBox({ title, items, onAdd, onRemove }) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setInput('')
  }

  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-5 h-full">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-muted">{title}</h3>
      <div className="flex flex-wrap gap-2 min-h-[80px]">
        {(items || []).map((item) => (
          <span key={item} className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-sm">
            {item}
            <button type="button" onClick={() => onRemove(item)} className="text-ink-faint hover:text-error" aria-label={`Remove ${item}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="input flex-1"
          placeholder={`Add ${title.toLowerCase().slice(0, -1)}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <Button type="button" variant="secondary" onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  )
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMyProfile()
      setProfile(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const patch = async (fields) => {
    const updated = await updateMyProfile(fields)
    setProfile(updated)
    setSuccess('Profile saved')
    setTimeout(() => setSuccess(''), 2500)
  }

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => patch({ profilePictureUrl: reader.result })
    reader.readAsDataURL(file)
  }

  const computed = useMemo(() => computeSalary(profile?.monthlyWage || 0), [profile?.monthlyWage])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!profile) {
    return <p className="py-16 text-center text-ink-muted">{error || 'Profile not found'}</p>
  }

  const fullName = `${profile.firstName} ${profile.lastName}`

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">My Profile</h1>

      {error && <Alert variant="destructive" description={error} />}
      {success && <Alert variant="success" description={success} />}

      <div className="card p-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_1fr]">
          <div className="relative mx-auto lg:mx-0">
            {profile.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt="" className="h-36 w-36 rounded-full object-cover border-4 border-cream" />
            ) : (
              <Avatar firstName={profile.firstName} lastName={profile.lastName} size="xl" className="!h-36 !w-36 !text-3xl" />
            )}
            <label className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90" title="Change photo">
              <Pencil className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
            </label>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold">{fullName}</h2>
            <InfoRow label="Login ID" value={profile.loginId} mono />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Mobile" value={profile.phoneNumber} />
          </div>

          <div className="space-y-3">
            <InfoRow label="Company" value={profile.companyName} />
            <InfoRow label="Department" value={profile.department} />
            <InfoRow label="Manager" value={profile.managerName || '—'} />
            <InfoRow label="Location" value={profile.location || '—'} />
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-2xl bg-cream p-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === i ? 'bg-white text-primary shadow-soft' : 'text-ink-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="card p-6">
          <EditableBlock
            title="Resume"
            value={profile.resumeText}
            onSave={(resumeText) => patch({ resumeText })}
          />
        </div>
      )}

      {tab === 1 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <EditableBlock title="About" value={profile.about} onSave={(about) => patch({ about })} />
            <EditableBlock title="What I love about my job" value={profile.jobLoves} onSave={(jobLoves) => patch({ jobLoves })} />
            <EditableBlock title="My interests and hobbies" value={profile.interestsHobbies} onSave={(interestsHobbies) => patch({ interestsHobbies })} />
          </div>
          <div className="space-y-6">
            <ListBox
              title="Skills"
              items={profile.skills}
              onAdd={(skill) => patch({ skills: [...(profile.skills || []), skill] })}
              onRemove={(skill) => patch({ skills: (profile.skills || []).filter((s) => s !== skill) })}
            />
            <ListBox
              title="Certifications"
              items={profile.certifications}
              onAdd={(cert) => patch({ certifications: [...(profile.certifications || []), cert] })}
              onRemove={(cert) => patch({ certifications: (profile.certifications || []).filter((c) => c !== cert) })}
            />
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="card space-y-5 p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-sm font-semibold">Monthly wage</label>
              <input
                type="number"
                className="input mt-1 w-48"
                value={profile.monthlyWage ?? ''}
                onChange={(e) => setProfile({ ...profile, monthlyWage: Number(e.target.value) })}
              />
            </div>
            <Button onClick={() => patch({ monthlyWage: profile.monthlyWage })}>Save salary</Button>
          </div>
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
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      <p className={`mt-0.5 text-sm ${mono ? 'font-mono text-primary' : ''}`}>{value || '—'}</p>
    </div>
  )
}
