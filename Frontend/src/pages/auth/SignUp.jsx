import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, Mail, Phone, Upload, User, BadgeCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/brand/Logo'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '')
  return digits.length > 10 ? digits.slice(-10) : digits
}

export default function SignUp() {
  const { registerCompany } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    password: '',
    confirm: '',
    role: 'HR',
  })
  const [logo, setLogo] = useState(null)
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result)
    reader.readAsDataURL(file)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    const phoneNumber = normalizePhone(form.phone)
    if (!form.companyName.trim() || !form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError('Please fill company name, first name, last name, and email')
      return
    }
    if (phoneNumber.length !== 10) {
      setError('Phone number must be exactly 10 digits')
      return
    }
    if (!form.employeeId.trim()) {
      setError('Employee ID is required')
      return
    }
    if (!form.password || form.password.length < 8) {
      setError('Password is required (min 8 characters with upper, lower, digit, and special character)')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const result = await registerCompany({
        companyName: form.companyName.trim(),
        logoUrl: logo,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneNumber,
        employeeId: form.employeeId.trim(),
        password: form.password,
        confirmPassword: form.confirm,
        role: form.role,
      })
      setCreated(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-elevated">
        <div className="border-b border-outline-variant px-8 pb-6 pt-8 text-center">
          <div className="mb-4 inline-flex"><Logo className="h-12 w-12" /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Admin / HR signup. Use your company name to join an existing company, or create a new one. Employees are added by HR later.
          </p>
        </div>

        <div className="px-8 py-6">
          {error && <Alert variant="destructive" description={error} className="mb-4" />}

          {created ? (
            <div className="space-y-4">
              <Alert
                variant="success"
                title={created.joinedExistingCompany ? 'Joined existing company' : 'Account created'}
                description={
                  created.joinedExistingCompany
                    ? `You were added to ${created.companyName}. Check your email for the verification link.`
                    : 'Check your email for the verification link. You must verify before signing in.'
                }
              />
              <div className="rounded-xl bg-cream p-4 font-mono text-sm space-y-1">
                <p>Login ID: {created.loginId}</p>
                <p>Email: {created.email}</p>
                <p>Role: {created.role}</p>
                <p>Company: {created.companyName}</p>
                <p className="text-xs text-ink-muted pt-2">Use the verification link from your email (or backend console in dev).</p>
              </div>
              <Button
                className="w-full py-3"
                rounded
                onClick={() => navigate('/signin', {
                  state: {
                    role: 'admin',
                    message: `Verify your email, then sign in with Login ID: ${created.loginId}`,
                    loginId: created.loginId,
                  },
                })}
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Company name</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                    <input name="companyName" className="input pl-10" placeholder="Odoo India" value={form.companyName} onChange={onChange} required />
                  </div>
                  <label className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary text-primary hover:bg-primary-50" title="Upload logo">
                    {logo ? <img src={logo} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <Upload className="h-5 w-5" />}
                    <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
                  </label>
                </div>
                <p className="text-xs text-ink-muted">Same company name as teammates joins that company. A new name creates a new company.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">First name</label>
                  <input name="firstName" className="input" placeholder="Tom" value={form.firstName} onChange={onChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Last name</label>
                  <input name="lastName" className="input" placeholder="Doe" value={form.lastName} onChange={onChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Employee ID</label>
                <div className="relative">
                  <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input name="employeeId" className="input pl-10" placeholder="EMP001" value={form.employeeId} onChange={onChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Role</label>
                <select name="role" className="input" value={form.role} onChange={onChange}>
                  <option value="HR">HR</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input name="email" type="email" className="input pl-10" placeholder="you@company.com" value={form.email} onChange={onChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone (10 digits)</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input name="phone" className="input pl-10" placeholder="9876543210" value={form.phone} onChange={onChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <p className="text-xs text-ink-muted">Min 8 chars with uppercase, lowercase, digit, and special character (@$!%*?&)</p>
                <div className="relative">
                  <input name="password" type={show ? 'text' : 'password'} className="input pr-10" placeholder="Admin@123" value={form.password} onChange={onChange} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" onClick={() => setShow((v) => !v)}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Confirm password</label>
                <input name="confirm" type={show ? 'text' : 'password'} className="input" placeholder="Admin@123" value={form.confirm} onChange={onChange} required />
              </div>

              <Button type="submit" rounded className="w-full py-3" disabled={loading}>
                {loading ? 'Creating account…' : 'SIGN UP'}
              </Button>
            </form>
          )}
        </div>

        <div className="border-t border-outline-variant bg-cream/50 px-8 py-5 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/signin" state={location.state} className="font-semibold text-primary">Sign In</Link>
        </div>
      </div>
    </div>
  )
}
