import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RunsProvider, useRuns } from './RunsContext'
import userEvent from '@testing-library/user-event'

function TestComponent() {
  const { runs, addRun } = useRuns()

  return (
    <div>
      <div data-testid="count">{runs.length}</div>
      <button
        onClick={() =>
          addRun({ date: '2026-03-01', distance: 3.1, duration: '00:27:00', notes: '' })
        }
      >
        Add Run
      </button>
    </div>
  )
}

describe('RunsContext', () => {
  it('adds a run immutably and updates consumers', async () => {
    const user = userEvent.setup()

    render(
      <RunsProvider>
        <TestComponent />
      </RunsProvider>
    )

    const count = screen.getByTestId('count')
    const initial = Number(count.textContent)

    await user.click(screen.getByRole('button', { name: /add run/i }))

    expect(Number(count.textContent)).toBe(initial + 1)
  })
})