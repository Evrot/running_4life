import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import Navigation from './Navigation'

function HomePageMock() {
  return <div>Home Page</div>
}

function LoginPageMock() {
  return <div>Login Page</div>
}

function RegisterPageMock() {
  return <div>Register Page</div>
}

function RunsPageMock() {
  return <div>Runs Page</div>
}

function NewRunPageMock() {
  return <div>New Run Page</div>
}

function renderNavigation(initialRoute = '/') {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePageMock />} />
          <Route path="/login" element={<LoginPageMock />} />
          <Route path="/register" element={<RegisterPageMock />} />
          <Route path="/runs" element={<RunsPageMock />} />
          <Route path="/runs/new" element={<NewRunPageMock />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('Navigation', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('shows login and register links when logged out', () => {
    renderNavigation()

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument()

    expect(screen.queryByRole('link', { name: /runs/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /add run/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument()
  })

  it('shows authenticated navigation links when logged in', async () => {
    sessionStorage.setItem('running4life_token', 'token')
    sessionStorage.setItem(
      'running4life_user',
      JSON.stringify({ id: '1', name: 'Danniel', email: 'test@example.com' })
    )
    sessionStorage.setItem('running4life_token_exp', String(Date.now() + 60_000))

    renderNavigation()

    expect(await screen.findByRole('link', { name: /runs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add run/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()

    expect(screen.queryByRole('link', { name: /^login$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^register$/i })).not.toBeInTheDocument()
  })

  it('logs out and navigates to login page', async () => {
    const user = userEvent.setup()

    sessionStorage.setItem('running4life_token', 'token')
    sessionStorage.setItem(
      'running4life_user',
      JSON.stringify({ id: '1', name: 'Danniel', email: 'test@example.com' })
    )
    sessionStorage.setItem('running4life_token_exp', String(Date.now() + 60_000))

    renderNavigation('/runs')

    await user.click(await screen.findByRole('button', { name: /logout/i }))

    expect(await screen.findByText(/login page/i)).toBeInTheDocument()
    expect(sessionStorage.getItem('running4life_token')).toBeNull()
    expect(sessionStorage.getItem('running4life_user')).toBeNull()
    expect(sessionStorage.getItem('running4life_token_exp')).toBeNull()
  })
})