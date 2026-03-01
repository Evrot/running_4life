import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import RunCard from './RunCard'

describe('RunCard', () => {
  it('renders run info and links to run details', () => {
    const run = { id: '99', date: '2026-03-01', distance: 5, duration: '00:40:00' }

    render(
      <MemoryRouter>
        <RunCard run={run} />
      </MemoryRouter>
    )

    expect(screen.getByText('2026-03-01')).toBeInTheDocument()
    expect(screen.getByText(/distance:\s*5/i)).toBeInTheDocument()
    expect(screen.getByText(/duration:\s*00:40:00/i)).toBeInTheDocument()

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/runs/99')
  })
})