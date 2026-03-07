import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RunsPage from './RunsPage'

vi.mock('../contexts/RunsContext', () => ({
  useRuns: () => ({
    runs: [
      { id: '1', date: '2026-02-25', distance: 3.2, duration: '00:28:10', notes: 'Easy run.' },
      { id: '2', date: '2026-02-26', distance: 4.1, duration: '00:36:05', notes: '' },
    ],
  }),
}))

describe('RunsPage', () => {
  it('renders the runs page heading and helper text', () => {
    render(
      <MemoryRouter>
        <RunsPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /runs/i })).toBeInTheDocument()
    expect(screen.getByText(/click a run to view details/i)).toBeInTheDocument()
  })

  it('renders the add run link', () => {
    render(
      <MemoryRouter>
        <RunsPage />
      </MemoryRouter>
    )

    const addRunLink = screen.getByRole('link', { name: /add run/i })
    expect(addRunLink).toBeInTheDocument()
    expect(addRunLink).toHaveAttribute('href', '/runs/new')
  })

  it('renders existing runs from context', () => {
    render(
      <MemoryRouter>
        <RunsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('2026-02-25')).toBeInTheDocument()
    expect(screen.getByText('2026-02-26')).toBeInTheDocument()
  })
})