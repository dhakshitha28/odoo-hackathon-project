import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmailRequest } from '../../api/auth'
import Logo from '../../components/brand/Logo'
import Button from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing.')
      return
    }

    verifyEmailRequest(token)
      .then((msg) => {
        setStatus('success')
        setMessage(msg)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.message)
      })
  }, [token])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-elevated px-8 py-10 text-center">
        <div className="mb-4 inline-flex"><Logo className="h-12 w-12" /></div>
        <h1 className="text-2xl font-extrabold tracking-tight">Email verification</h1>

        <div className="mt-6">
          {status === 'loading' && (
            <p className="text-sm text-ink-muted">Verifying your email…</p>
          )}
          {status === 'success' && (
            <>
              <Alert variant="success" description={message} className="mb-4 text-left" />
              <Button className="w-full py-3" rounded onClick={() => navigate('/signin', { state: { role: 'admin' } })}>
                Go to Sign In
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <Alert variant="destructive" description={message} className="mb-4 text-left" />
              <Link to="/signin" className="font-semibold text-primary">Back to Sign In</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
