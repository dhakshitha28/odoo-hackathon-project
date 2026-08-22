import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

export default function ChangePassword() {
  const { user, changePassword, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) {
    navigate('/signin')
    return null
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.next.length < 8) return setError('New password must be at least 8 characters')
    if (form.next !== form.confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      changePassword(form.current, form.next)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Change password" subtitle="Your first login uses a system-generated password. Set a new one to continue.">
      {error && <Alert variant="destructive" description={error} className="mb-4" />}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Current password</label>
          <input type="password" className="input" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">New password</label>
          <input type="password" className="input" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Confirm password</label>
          <input type="password" className="input" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving…' : 'Save and continue'}
        </Button>
        <button type="button" className="w-full text-sm text-ink-muted" onClick={() => { logout(); navigate('/signin') }}>
          Sign out
        </button>
      </form>
    </AuthLayout>
  )
}
