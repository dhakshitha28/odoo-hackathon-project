import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Button from '../ui/Button'
import { Alert } from '../ui/Alert'
import { Mountain, Mail, Lock, Eye, EyeOff, User, Phone, Shield } from 'lucide-react'

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', role: 'EMPLOYEE', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Full name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email'
    if (form.password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(form.password)) return 'Password must contain an uppercase letter'
    if (!/[0-9]/.test(form.password)) return 'Password must contain a number'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const v = validate()
    if (v) { setError(v); return }
    setLoading(true)
    try {
      await api.post('/auth/signup', {
        firstName: form.firstName, lastName: form.lastName, email: form.email,
        phone: form.phone, role: form.role, password: form.password,
      })
      navigate('/signin', { state: { message: 'Account created successfully! Please sign in.' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  const Field = ({ label, name, type = 'text', icon: Icon, placeholder, autoComplete }) => (
    <div className="space-y-2">
      <label className="block font-label text-sm font-semibold text-on-surface">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline"><Icon className="w-5 h-5" /></div>
        <input name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange} className="input pl-10" autoComplete={autoComplete} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-primary-50 rounded-full blur-[120px] opacity-30 -top-1/4 -left-1/4" />
        <div className="absolute w-[600px] h-[600px] bg-secondary-container rounded-full blur-[100px] opacity-30 bottom-0 right-0" />
      </div>

      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-soft overflow-hidden flex flex-col">
        <div className="pt-10 pb-6 px-6 sm:px-8 text-center border-b border-outline-variant bg-surface-container-low">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-6">
            <Mountain className="w-8 h-8" />
          </div>
          <h1 className="font-headline text-3xl font-semibold text-on-surface mb-2">HR Connect</h1>
          <p className="font-body text-sm text-on-surface-variant">Create your account</p>
        </div>

        <div className="p-6 sm:px-8 sm:py-8 flex-1">
          {error && <Alert variant="destructive" description={error} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" name="firstName" icon={User} placeholder="First name" autoComplete="given-name" />
              <Field label="Last Name" name="lastName" icon={User} placeholder="Last name" autoComplete="family-name" />
            </div>
            <Field label="Email Address" name="email" type="email" icon={Mail} placeholder="you@company.com" autoComplete="email" />
            <Field label="Phone Number" name="phone" type="tel" icon={Phone} placeholder="+91 98765 43210" autoComplete="tel" />

            <div className="space-y-2">
              <label className="block font-label text-sm font-semibold text-on-surface">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline"><Shield className="w-5 h-5" /></div>
                <select name="role" value={form.role} onChange={handleChange} className="input pl-10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2012%2012%22%20fill=%22none%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M3%204.5L6%207.5L9%204.5%22%20stroke=%22%239a9088%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat">
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin / HR Officer</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-label text-sm font-semibold text-on-surface">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline"><Lock className="w-5 h-5" /></div>
                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} className="input pl-10 pr-10" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-3 mt-1">
                <span className={`text-xs font-label ${form.password.length >= 8 ? 'text-status-present' : 'text-on-surface-variant'}`}>8+ chars</span>
                <span className={`text-xs font-label ${/[A-Z]/.test(form.password) ? 'text-status-present' : 'text-on-surface-variant'}`}>Uppercase</span>
                <span className={`text-xs font-label ${/[0-9]/.test(form.password) ? 'text-status-present' : 'text-on-surface-variant'}`}>Number</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-label text-sm font-semibold text-on-surface">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline"><Lock className="w-5 h-5" /></div>
                <input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} className="input pl-10" autoComplete="new-password" />
              </div>
              {form.confirmPassword && (
                <p className={`text-xs font-label ${form.password === form.confirmPassword ? 'text-status-present' : 'text-error'}`}>
                  {form.password === form.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full btn-rounded py-3" disabled={loading}>
                {loading ? <div className="h-4 w-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : 'Create Account'}
              </Button>
            </div>
          </form>
        </div>

        <div className="px-6 py-5 bg-surface-container-low border-t border-outline-variant text-center">
          <p className="font-body text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/signin" className="font-label text-sm font-semibold text-primary hover:text-primary-400 ml-1 transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
