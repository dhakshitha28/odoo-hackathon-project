import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Mountain, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-primary-50 rounded-full blur-[120px] opacity-30 -top-1/4 -left-1/4" />
        <div className="absolute w-[600px] h-[600px] bg-secondary-container rounded-full blur-[100px] opacity-30 bottom-0 right-0" />
      </div>

      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-soft overflow-hidden flex flex-col">
        {/* Header */}
        <div className="pt-10 pb-6 px-6 sm:px-8 text-center border-b border-outline-variant bg-surface-container-low">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-6">
            <Mountain className="w-8 h-8" />
          </div>
          <h1 className="font-headline text-3xl font-semibold text-on-surface mb-2">HR Connect</h1>
          <p className="font-body text-sm text-on-surface-variant">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="p-6 sm:px-8 sm:py-8 flex-1">
          {successMessage && <Alert variant="success" description={successMessage} className="mb-6" />}
          {error && <Alert variant="destructive" description={error} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block font-label text-sm font-semibold text-on-surface">Login ID / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. 01JD2024001 or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-label text-sm font-semibold text-on-surface">Password</label>
                <a className="font-label text-sm font-medium text-primary hover:text-primary-400 transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full btn-rounded py-3" disabled={loading}>
                {loading ? (
                  <div className="h-4 w-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-surface-container-low border-t border-outline-variant text-center">
          <p className="font-body text-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-label text-sm font-semibold text-primary hover:text-primary-400 ml-1 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
