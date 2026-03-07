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

function isValidName(name) {
  return /^[a-zA-Z\s'-]+$/.test(name)
}

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const storedCsrfToken = sessionStorage.getItem(CSRF_KEY)

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (normalizedName.length < 2 || normalizedName.length > 50) {
      setError('Name must be between 2 and 50 characters.')
      return
    }

    if (!isValidName(normalizedName)) {
      setError("Name can only contain letters, spaces, apostrophes, and hyphens.")
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password.length > 128) {
      setError('Password is too long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!csrfToken || !storedCsrfToken || csrfToken !== storedCsrfToken) {
      setError('Security validation failed. Please refresh and try again.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = register({
        name: normalizedName,
        email: normalizedEmail,
        password,
      })

      if (!result.success) {
        setError(result.message)
        return
      }

      setSuccess('Registration successful. You can now log in.')
      navigate('/login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="stack">
      <Card>
        <h2>Register</h2>
        <p>Create an account to save and manage your runs.</p>

        <Alert message={error || success} />

        <form onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="csrfToken" value={csrfToken} />

          <div>
            <label htmlFor="register-name">Name</label>
            <Input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label htmlFor="register-email">Email</label>
            <Input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              maxLength={128}
              required
            />
          </div>

          <div>
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <Input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              maxLength={128}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p style={{ marginTop: '12px' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Card>
    </div>
  )
}

export default RegisterPage