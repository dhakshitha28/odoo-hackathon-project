import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { Bell, Palette, Shield, User } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Limited self-service fields. HR can update the rest from your profile.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><User className="h-4 w-4 text-primary" /> Profile</h2>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Phone
              <input className="input mt-1" defaultValue={user.phone} />
            </label>
            <label className="block text-sm font-semibold">Address
              <input className="input mt-1" defaultValue={user.address} />
            </label>
            <Button>Save</Button>
          </div>
        </section>
        <section className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Shield className="h-4 w-4 text-primary" /> Security</h2>
          <p className="text-sm text-ink-muted">Use first-login change password after HR creates your account.</p>
        </section>
        <section className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Bell className="h-4 w-4 text-primary" /> Notifications</h2>
          {['Leave updates', 'Attendance reminders', 'Payroll'].map((item) => (
            <label key={item} className="flex items-center justify-between py-2 text-sm">
              {item}
              <span className="h-5 w-9 rounded-full bg-primary" />
            </label>
          ))}
        </section>
        <section className="card p-6">
          <h2 className="mb-2 flex items-center gap-2 font-semibold"><Palette className="h-4 w-4 text-primary" /> Appearance</h2>
          <p className="text-sm text-ink-muted">Dayflow light theme is active.</p>
        </section>
      </div>
    </div>
  )
}
