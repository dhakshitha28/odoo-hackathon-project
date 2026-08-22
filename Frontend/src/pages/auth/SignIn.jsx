import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/brand/Logo'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

export default function SignIn() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const portal = location.state?.role === 'employee' ? 'employee' : location.state?.role === 'admin' ? 'admin' : null
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const successMessage = location.state?.message

  const titles = {
    employee: { title: 'Employee Login', sub: 'Check in, view attendance and request time off.' },
    admin: { title: 'Admin / HR Login', sub: 'Manage people, approve leave and run payroll.' },
  }
  const heading = portal ? titles[portal].title : 'Welcome to Dayflow'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!identifier.trim() || !password.trim()) {
      setError('Enter Login ID / email and password')
      return
    }
    setLoading(true)
    setTimeout(() => {
      try {
        const userData = login(identifier, password)
        const isManager = userData.role === 'ADMIN' || userData.role === 'HR'
        if (portal === 'employee' && isManager) {
          logout()
          setError('This is not an employee account. Use the Admin/HR login instead.')
          setLoading(false)
          return
        }
        if (portal === 'admin' && !isManager) {
          logout()
          setError('This account does not have Admin/HR access. Use the Employee login instead.')
          setLoading(false)
          return
        }
        navigate('/dashboard')
      } catch (err) {
        setError(err.message || 'Invalid Login ID or password')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-elevated">
        <div className="border-b border-outline-variant px-8 pb-6 pt-8 text-center">
          <div className="mb-4 inline-flex"><Logo className="h-12 w-12" /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{heading}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {portal ? titles[portal].sub : 'Every workday, perfectly aligned.'}
          </p>
        </div>

        <div className="px-8 py-6">
          {successMessage && <Alert variant="success" description={successMessage} className="mb-4" />}
          {error && <Alert variant="destructive" description={error} className="mb-4" />}

          {!portal && (
            <p className="mb-5 rounded-xl border border-primary/15 bg-primary-50 p-3 text-xs text-ink-muted">
              Not sure which account you have?{' '}
              <Link to="/" className="font-semibold text-primary">Choose your role first</Link>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-id" className="text-sm font-semibold">Login ID / Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  id="login-id"
                  type="text"
                  className="input pl-10"
                  placeholder="Enter your Login ID or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" onClick={() => setShow((v) => !v)} aria-label="Show password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" rounded className="w-full py-3" disabled={loading}>
              {loading ? 'Signing in…' : 'SIGN IN'}
            </Button>
          </form>
        </div>

        <div className="border-t border-outline-variant bg-cream/50 px-8 py-5 text-center text-sm text-ink-muted">
          <Link to="/" className="inline-flex items-center gap-1 font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to role selection
          </Link>
          <p className="mt-2">
            Don&apos;t have an Account?{' '}
            <Link to="/signup" className="font-semibold text-primary">Sign Up</Link>
          </p>
          {portal === 'employee' && <p className="mt-2 text-xs">Employees cannot self-register. Ask HR or Admin for credentials.</p>}
        </div>
      </div>
    </div>
  )
}
