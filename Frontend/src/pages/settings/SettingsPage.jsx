import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { isManager } from '../../api/unwrap'
import { updateEmployeeProfile } from '../../api/employee'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Shield, User } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePicture || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setProfilePictureUrl(user?.profilePicture || '')
  }, [user])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      await updateEmployeeProfile({ phoneNumber, address, profilePictureUrl })
      setMessage('Profile updated')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Employees can update address, phone, and profile picture only.</p>
      </div>
      {error && <Alert variant="destructive" description={error} />}
      {message && <Alert variant="success" description={message} />}
      {!isManager(user?.role) ? (
        <form className="card max-w-xl space-y-3 p-6" onSubmit={save}>
          <h2 className="mb-2 flex items-center gap-2 font-semibold"><User className="h-4 w-4 text-primary" /> Limited profile</h2>
          <label className="block text-sm font-semibold">Phone
            <input className="input mt-1" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="10 digits" />
          </label>
          <label className="block text-sm font-semibold">Address
            <input className="input mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold">Profile picture URL
            <input className="input mt-1" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />
          </label>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </form>
      ) : (
        <p className="text-sm text-ink-muted">Admin/HR profile editing uses My Profile (`/api/profile/me`).</p>
      )}
      <section className="card max-w-xl p-6">
        <h2 className="mb-2 flex items-center gap-2 font-semibold"><Shield className="h-4 w-4 text-primary" /> Security</h2>
        <p className="text-sm text-ink-muted">Login ID: {user?.loginId}. Logout discards the JWT on this device. There is no separate logout API.</p>
      </section>
    </div>
  )
}
