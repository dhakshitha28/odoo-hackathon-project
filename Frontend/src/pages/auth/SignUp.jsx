import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, Mail, Phone, Upload, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/brand/Logo'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

export default function SignUp() {
  const { registerCompany } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    companyName: '', name: '', email: '', phone: '', password: '', confirm: '',
  })
  const [logo, setLogo] = useState(null)
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result)
    reader.readAsDataURL(file)
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.companyName.trim() || !form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill company name, your name, email, and phone')
      return
    }
    if (form.password && form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    try {
      const result = registerCompany({
        companyName: form.companyName,
        logoDataUrl: logo,
        name: form.name,
        email: form.email,
        phone: form.phone,
      })
      setCreated(result)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-elevated">
        <div className="border-b border-outline-variant px-8 pb-6 pt-8 text-center">
          <div className="mb-4 inline-flex"><Logo className="h-12 w-12" /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create company</h1>
          <p className="mt-2 text-sm text-ink-muted">For Admin / company setup only. Employees are added by HR.</p>
        </div>

        <div className="px-8 py-6">
          {error && <Alert variant="destructive" description={error} className="mb-4" />}

          {created ? (
            <div className="space-y-4">
              <Alert variant="success" title="Account created" description="Use the generated Login ID as your first password, then change it after sign in." />
              <div className="rounded-xl bg-cream p-4 font-mono text-sm">
                <p>Login ID: {created.loginId}</p>
                <p>First password: {created.loginId}</p>
              </div>
              <Button className="w-full py-3" rounded onClick={() => navigate('/signin', { state: { message: `Sign in with ${created.loginId}` } })}>
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
                    <input name="companyName" className="input pl-10" placeholder="Odoo India" value={form.companyName} onChange={onChange} />
                  </div>
                  <label className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary text-primary hover:bg-primary-50" title="Upload logo">
                    {logo ? <img src={logo} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <Upload className="h-5 w-5" />}
                    <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input name="name" className="input pl-10" placeholder="John Doe" value={form.name} onChange={onChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input name="email" type="email" className="input pl-10" placeholder="you@company.com" value={form.email} onChange={onChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input name="phone" className="input pl-10" placeholder="+91 98765 43210" value={form.phone} onChange={onChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <p className="text-xs text-ink-muted">Ignored for first login. The system generates the Login ID as the first password.</p>
                <div className="relative">
                  <input name="password" type={show ? 'text' : 'password'} className="input pr-10" placeholder="Optional" value={form.password} onChange={onChange} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" onClick={() => setShow((v) => !v)}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Confirm password</label>
                <input name="confirm" type={show ? 'text' : 'password'} className="input" placeholder="Optional" value={form.confirm} onChange={onChange} />
              </div>
              <Button type="submit" rounded className="w-full py-3">SIGN UP</Button>
            </form>
          )}
        </div>

        <div className="border-t border-outline-variant bg-cream/50 px-8 py-5 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-primary">Sign In</Link>
        </div>
      </div>
    </div>
  )
}
