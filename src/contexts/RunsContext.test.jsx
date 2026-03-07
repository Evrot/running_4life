import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RunsProvider, useRuns } from './RunsContext'

function TestConsumer() {
  const { runs, addRun, updateRun, deleteRun, getRunById } = useRuns()

  return (
    <div>
      <div data-testid="run-count">{runs.length}</div>
      <div data-testid="first-run-notes">{runs[0]?.notes || ''}</div>
      <div data-testid="lookup">{getRunById('missing') ? 'found' : 'not-found'}</div>

      <button
        onClick={() =>
          addRun({
            date: '2026-03-01',
            distance: 5,
            duration: '00:42:00',
            notes: '<b>Strong run</b>',
          })
        }
      >
        Add Run
      </button>

      <button
        onClick={() => {
          if (runs[0]) updateRun(runs[0].id, { notes: '<script>alert(1)</script>' })
        }}
      >
        Update Run
      </button>

      <button
        onClick={() => {
          if (runs[0]) deleteRun(runs[0].id)
        }}
      >
        Delete Run
      </button>
    </div>
  )
}

describe('RunsContext', () => {
  it('adds a run successfully', async () => {
    const user = userEvent.setup()

    render(
      <RunsProvider>
        <TestConsumer />
      </RunsProvider>
    )

    await user.click(screen.getByRole('button', { name: /add run/i }))

    expect(screen.getByTestId('run-count').textContent).toBe('1')
  })

  it('sanitizes notes when adding a run', async () => {
    const user = userEvent.setup()

    render(
      <RunsProvider>
        <TestConsumer />
      </RunsProvider>
    )

    await user.click(screen.getByRole('button', { name: /add run/i }))

    expect(screen.getByTestId('first-run-notes').textContent).toBe('bStrong run/b')
  })

  it('updates a run safely', async () => {
    const user = userEvent.setup()

    render(
      <RunsProvider>
        <TestConsumer />
      </RunsProvider>
    )

    await user.click(screen.getByRole('button', { name: /add run/i }))
    await user.click(screen.getByRole('button', { name: /update run/i }))

    expect(screen.getByTestId('first-run-notes').textContent).toContain('scriptalert(1)/script')
  })

  it('deletes a run', async () => {
    const user = userEvent.setup()

    render(
      <RunsProvider>
        <TestConsumer />
      </RunsProvider>
    )

    await user.click(screen.getByRole('button', { name: /add run/i }))
    await user.click(screen.getByRole('button', { name: /delete run/i }))

    expect(screen.getByTestId('run-count').textContent).toBe('0')
  })

  it('returns not found for missing run id', () => {
    render(
      <RunsProvider>
        <TestConsumer />
      </RunsProvider>
    )

    expect(screen.getByTestId('lookup').textContent).toBe('not-found')
  })
})