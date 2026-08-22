import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../lib/utils'
import { computeSalary } from '../../lib/salary'
import { getSalaryBreakdown } from '../../api/profile'

function ComponentCard({ item }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-cream/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-sm font-bold text-on-surface">{item.label}</h4>
        <div className="text-right">
          <p className="text-base font-bold text-primary">{formatCurrency(item.amount)} <span className="text-xs font-medium text-ink-muted">/ month</span></p>
          {item.percentLabel && (
            <p className="text-xs font-semibold text-ink-faint">{item.percentLabel}</p>
          )}
        </div>
      </div>
      {item.note && (
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.note}</p>
      )}
    </div>
  )
}

function Section({ title, items }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{title}</h3>
      {items.map((item) => (
        <ComponentCard key={item.label} item={item} />
      ))}
    </div>
  )
}

export default function SalaryInfoTab({ profile, onSave, onProfileChange }) {
  const [breakdown, setBreakdown] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const preview = useMemo(
    () => computeSalary(profile.monthlyWage, profile.workingDaysPerWeek, profile.breakTimeHours),
    [profile.monthlyWage, profile.workingDaysPerWeek, profile.breakTimeHours]
  )

  const loadBreakdown = () => {
    setLoading(true)
    getSalaryBreakdown()
      .then(setBreakdown)
      .catch(() => setBreakdown(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBreakdown()
  }, [])

  const savedWage = breakdown?.monthlyWage
  const wageDirty =
    Number(profile.monthlyWage) !== Number(savedWage) ||
    Number(profile.workingDaysPerWeek) !== Number(breakdown?.workingDaysPerWeek) ||
    Number(profile.breakTimeHours) !== Number(breakdown?.breakTimeHours)

  const display = wageDirty || !breakdown ? preview : breakdown

  const save = async () => {
    setSaving(true)
    try {
      await onSave({
        monthlyWage: profile.monthlyWage,
        workingDaysPerWeek: profile.workingDaysPerWeek,
        breakTimeHours: profile.breakTimeHours,
      })
      const data = await getSalaryBreakdown()
      setBreakdown(data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Month Wage">
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              className="input w-full"
              value={profile.monthlyWage ?? ''}
              onChange={(e) => onProfileChange({ monthlyWage: Number(e.target.value) })}
            />
            <span className="shrink-0 text-sm text-ink-muted">/ Month</span>
          </div>
        </Field>
        <Field label="Yearly wage">
          <p className="text-lg font-bold text-primary">
            {formatCurrency(display.yearlyWage)} <span className="text-sm font-medium text-ink-muted">/ Yearly</span>
          </p>
        </Field>
        <Field label="No of working days in a week">
          <input
            type="number"
            min={1}
            max={7}
            className="input w-full"
            value={profile.workingDaysPerWeek ?? ''}
            onChange={(e) => onProfileChange({ workingDaysPerWeek: Number(e.target.value) })}
          />
        </Field>
        <Field label="Break Time">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={0.5}
              className="input w-full"
              value={profile.breakTimeHours ?? ''}
              onChange={(e) => onProfileChange({ breakTimeHours: Number(e.target.value) })}
            />
            <span className="shrink-0 text-sm text-ink-muted">/ hrs</span>
          </div>
        </Field>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save salary settings'}</Button>
      </div>

      {loading && !breakdown ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Section title="Salary Components" items={display.salaryComponents} />
          <div className="space-y-8">
            <Section title="PF Contribution" items={display.pfContributions} />
            <Section title="Tax Deductions" items={display.taxDeductions} />
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      {children}
    </div>
  )
}
