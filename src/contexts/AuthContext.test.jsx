import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

function TestConsumer() {
  const { user, isAuthenticated, register, login, logout } = useAuth()

  return (
    <div>
      <div data-testid="auth-state">{isAuthenticated ? 'authenticated' : 'guest'}</div>
      <div data-testid="user-email">{user?.email || ''}</div>

      <button
        onClick={() =>
          register({
            name: 'Danniel',
            email: 'test@example.com',
            password: 'secret123',
          })
        }
      >
        Register
      </button>

      <button onClick={() => login('test@example.com', 'secret123')}>Login</button>
      <button onClick={() => login('test@example.com', 'wrongpass')}>Bad Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('starts unauthenticated', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-state').textContent).toBe('guest')
    expect(screen.getByTestId('user-email').textContent).toBe('')
  })

  it('registers a new user successfully', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await user.click(screen.getByRole('button', { name: /register/i }))

    const savedUsers = JSON.parse(localStorage.getItem('running4life_users'))
    expect(savedUsers).toHaveLength(1)
    expect(savedUsers[0].email).toBe('test@example.com')
  })

  it('logs in with valid credentials', async () => {
    const appUser = userEvent.setup()

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await appUser.click(screen.getByRole('button', { name: /register/i }))
    await appUser.click(screen.getByRole('button', { name: /^login$/i }))

    expect(screen.getByTestId('auth-state').textContent).toBe('authenticated')
    expect(screen.getByTestId('user-email').textContent).toBe('test@example.com')
    expect(sessionStorage.getItem('running4life_token')).toBeTruthy()
  })

  it('does not authenticate with invalid credentials', async () => {
    const appUser = userEvent.setup()

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await appUser.click(screen.getByRole('button', { name: /register/i }))
    await appUser.click(screen.getByRole('button', { name: /bad login/i }))

    expect(screen.getByTestId('auth-state').textContent).toBe('guest')
  })

  it('logs out and clears session storage', async () => {
    const appUser = userEvent.setup()

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await appUser.click(screen.getByRole('button', { name: /register/i }))
    await appUser.click(screen.getByRole('button', { name: /^login$/i }))
    await appUser.click(screen.getByRole('button', { name: /logout/i }))

    expect(screen.getByTestId('auth-state').textContent).toBe('guest')
    expect(sessionStorage.getItem('running4life_token')).toBeNull()
    expect(sessionStorage.getItem('running4life_user')).toBeNull()
    expect(sessionStorage.getItem('running4life_token_exp')).toBeNull()
  })

  it('restores a valid session from sessionStorage', async () => {
    const savedUser = { id: '1', name: 'Danniel', email: 'saved@example.com' }
    sessionStorage.setItem('running4life_token', 'mock-token')
    sessionStorage.setItem('running4life_user', JSON.stringify(savedUser))
    sessionStorage.setItem('running4life_token_exp', String(Date.now() + 60_000))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('authenticated')
    })

    expect(screen.getByTestId('user-email').textContent).toBe('saved@example.com')
  })

  it('clears expired session on load', async () => {
    const savedUser = { id: '1', name: 'Danniel', email: 'expired@example.com' }
    sessionStorage.setItem('running4life_token', 'expired-token')
    sessionStorage.setItem('running4life_user', JSON.stringify(savedUser))
    sessionStorage.setItem('running4life_token_exp', String(Date.now() - 1000))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('guest')
    })

    expect(sessionStorage.getItem('running4life_token')).toBeNull()
  })

  it('handles invalid stored user JSON safely', async () => {
    sessionStorage.setItem('running4life_token', 'mock-token')
    sessionStorage.setItem('running4life_user', '{bad json')
    sessionStorage.setItem('running4life_token_exp', String(Date.now() + 60_000))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('guest')
    })
  })
})