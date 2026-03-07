import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const mockUseAuth = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

function SecretPage() {
  return <div>Protected Content</div>
}

function LoginPageMock() {
  return <div>Login Page</div>
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users to login', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    })

    render(
      <MemoryRouter initialEntries={['/runs']}>
        <Routes>
          <Route
            path="/runs"
            element={
              <ProtectedRoute>
                <SecretPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPageMock />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/login page/i)).toBeInTheDocument()
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
    })

    render(
      <MemoryRouter initialEntries={['/runs']}>
        <Routes>
          <Route
            path="/runs"
            element={
              <ProtectedRoute>
                <SecretPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPageMock />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/protected content/i)).toBeInTheDocument()
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument()
  })
})