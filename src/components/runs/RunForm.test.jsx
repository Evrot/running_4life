import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import RunForm from './RunForm'

// Mock useNavigate so we can assert navigation without real routing
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// Mock context hook so we can control addRun
vi.mock('../../contexts/RunsContext', () => {
  return {
    useRuns: () => ({
      addRun: () => '123', // pretend new run id returned
    }),
  }
})

describe('RunForm', () => {
  it('shows validation error when required fields are missing', async () => {
    const user = userEvent.setup()
    render(<RunForm />)

    await user.click(screen.getByRole('button', { name: /save run/i }))
    expect(screen.getByText(/please fill date, distance, and duration/i)).toBeInTheDocument()
  })

  it('submits when fields are filled', async () => {
    const user = userEvent.setup()
    render(<RunForm />)

    // Use label text to find inputs (your form has <label>Date</label> etc.)
    await user.type(screen.getByLabelText(/distance/i), '3.5')
    await user.type(screen.getByLabelText(/duration/i), '00:30:00')
    // date input needs a direct value set:
    await user.type(screen.getByLabelText(/date/i), '2026-03-01')

    await user.click(screen.getByRole('button', { name: /save run/i }))

    // If submit worked, the error message should NOT exist
    expect(screen.queryByText(/please fill date, distance, and duration/i)).not.toBeInTheDocument()
  })
})