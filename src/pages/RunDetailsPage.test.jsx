import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RunsProvider, useRuns } from '../contexts/RunsContext'
import RunDetailsPage from './RunDetailsPage'

function SeededRuns({ children }) {
  const { addRun } = useRuns()

  if (!window.__SEEDED__) {
    addRun({
      date: '2026-03-01',
      distance: 5,
      duration: '00:40:00',
      notes: 'Nice tempo run',
    })
    window.__SEEDED__ = true
  }

  return children
}

describe('RunDetailsPage', () => {
  it('shows run not found for invalid id', () => {
    render(
      <RunsProvider>
        <MemoryRouter initialEntries={['/runs/999']}>
          <Routes>
            <Route path="/runs/:id" element={<RunDetailsPage />} />
            <Route path="/runs" element={<div>Runs Page</div>} />
          </Routes>
        </MemoryRouter>
      </RunsProvider>
    )

    expect(screen.getByText(/run not found/i)).toBeInTheDocument()
  })
})