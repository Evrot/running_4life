import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import RegisterPage from './RegisterPage'

function LoginPageMock() {
  return <div>Login Screen</div>
}

function renderRegisterPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPageMock />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('shows error when fields are empty', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/^name$/i), 'Danniel')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'secret123')
    await user.type(screen.getByLabelText(/confirm password/i), 'different123')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('shows error for short password', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/^name$/i), 'Danniel')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password$/i), '123')
    await user.type(screen.getByLabelText(/confirm password/i), '123')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
  })

  it('registers successfully and navigates to login', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/^name$/i), 'Danniel')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'secret123')
    await user.type(screen.getByLabelText(/confirm password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText(/login screen/i)).toBeInTheDocument()
  })

  it('shows error for duplicate email', async () => {
    localStorage.setItem(
      'running4life_users',
      JSON.stringify([
        { id: '1', name: 'Danniel', email: 'test@example.com', password: 'secret123' },
      ])
    )

    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/^name$/i), 'Another User')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'secret123')
    await user.type(screen.getByLabelText(/confirm password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText(/account with this email already exists/i)).toBeInTheDocument()
  })
})