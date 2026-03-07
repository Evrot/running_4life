import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RunsProvider } from '../../contexts/RunsContext'
import RunForm from './RunForm'

function RunDetailsMock() {
  return <div>Run Details Page</div>
}

function renderRunForm() {
  return render(
    <RunsProvider>
      <MemoryRouter initialEntries={['/runs/new']}>
        <Routes>
          <Route path="/runs/new" element={<RunForm />} />
          <Route path="/runs/:id" element={<RunDetailsMock />} />
        </Routes>
      </MemoryRouter>
    </RunsProvider>
  )
}

describe('RunForm', () => {
  it('shows error when required fields are missing', async () => {
    const user = userEvent.setup()
    renderRunForm()

    await user.click(screen.getByRole('button', { name: /save run/i }))

    expect(screen.getByText(/please fill date, distance, and duration/i)).toBeInTheDocument()
  })

  it('shows error for invalid distance', async () => {
    const user = userEvent.setup()
    renderRunForm()

    await user.type(screen.getByLabelText(/date/i), '2026-03-01')
    await user.type(screen.getByLabelText(/distance/i), '-1')
    await user.type(screen.getByLabelText(/duration/i), '00:30:00')
    await user.click(screen.getByRole('button', { name: /save run/i }))

    expect(screen.getByText(/distance must be a positive number/i)).toBeInTheDocument()
  })

  it('shows error for invalid duration', async () => {
    const user = userEvent.setup()
    renderRunForm()

    await user.type(screen.getByLabelText(/date/i), '2026-03-01')
    await user.type(screen.getByLabelText(/distance/i), '3.5')
    await user.type(screen.getByLabelText(/duration/i), 'abc')
    await user.click(screen.getByRole('button', { name: /save run/i }))

    expect(screen.getByText(/duration must use hh:mm:ss format/i)).toBeInTheDocument()
  })

  it('submits successfully and navigates to details page', async () => {
    const user = userEvent.setup()
    renderRunForm()

    await user.type(screen.getByLabelText(/date/i), '2026-03-01')
    await user.type(screen.getByLabelText(/distance/i), '3.5')
    await user.type(screen.getByLabelText(/duration/i), '00:30:00')
    await user.type(screen.getByLabelText(/notes/i), 'Felt great today')
    await user.click(screen.getByRole('button', { name: /save run/i }))

    expect(await screen.findByText(/run details page/i)).toBeInTheDocument()
  })
})