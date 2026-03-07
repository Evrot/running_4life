import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { useAuth } from '../contexts/AuthContext'

const CSRF_KEY = 'running4life_csrf_token'

function generateCsrfToken() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    let token = sessionStorage.getItem(CSRF_KEY)

    if (!token) {
      token = generateCsrfToken()
      sessionStorage.setItem(CSRF_KEY, token)
    }

    setCsrfToken(token)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const normalizedEmail = email.trim().toLowerCase()
    const storedCsrfToken = sessionStorage.getItem(CSRF_KEY)

    if (!normalizedEmail || !password) {
      setError('Please enter your email and password.')
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (normalizedEmail.length > 254) {
      setError('Email is too long.')
      return
    }

    if (password.length > 128) {
      setError('Password is too long.')
      return
    }

    if (!csrfToken || !storedCsrfToken || csrfToken !== storedCsrfToken) {
      setError('Security validation failed. Please refresh and try again.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = login(normalizedEmail, password)

      if (!result.success) {
        setError(result.message)
        return
      }

      setSuccess('Login successful.')
      navigate('/runs')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="stack">
      <Card>
        <h2>Login</h2>
        <p>Sign in to access your running dashboard.</p>

        <Alert message={error || success} />

        <form onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="csrfToken" value={csrfToken} />

          <div>
            <label htmlFor="login-email">Email</label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>

          <div>
            <label htmlFor="login-password">Password</label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              maxLength={128}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p style={{ marginTop: '12px' }}>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage