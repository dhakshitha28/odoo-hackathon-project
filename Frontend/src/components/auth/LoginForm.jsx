import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Button from '../ui/Button'
import { Alert } from '../ui/Alert'

export default function LoginForm({ onSubmit, loading, error, initialIdentifier = '', initialPassword = '' }) {
  const [identifier, setIdentifier] = useState(initialIdentifier)
  const [password, setPassword] = useState(initialPassword)
  const [show, setShow] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ identifier, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Alert variant="destructive" description={error} />}
      <div className="space-y-2">
        <label htmlFor="login-id" className="text-sm font-semibold">
          Login ID or email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            id="login-id"
            type="text"
            autoComplete="username"
            placeholder="Enter your Login ID or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            id="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-on-surface"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full py-3" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  )
}
