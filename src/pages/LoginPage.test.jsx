import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import LoginPage from './LoginPage'

function RunsPageMock() {
  return <div>Runs Dashboard</div>
}

function renderLoginPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/runs" element={<RunsPageMock />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()

    localStorage.setItem(
      'running4life_users',
      JSON.stringify([
        {
          id: '1',
          name: 'Danniel',
          email: 'test@example.com',
          password: 'secret123',
        },
      ])
    )
  })

  it('shows error for empty fields', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/please enter your email and password/i)).toBeInTheDocument()
  })

  it('shows error for invalid credentials', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
  })

  it('logs in and navigates to runs page', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/runs dashboard/i)).toBeInTheDocument()
  })
})