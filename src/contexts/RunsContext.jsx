import React, { createContext, useContext, useMemo, useState } from 'react'

const RunsContext = createContext(null)

function makeId() {
  // simple MVP id generator
  return crypto?.randomUUID?.() ?? String(Date.now())
}

export function RunsProvider({ children }) {
  // Global shared state
  const [runs, setRuns] = useState([
    // You can start empty, or keep 1-2 seed runs for demo
    { id: '1', date: '2026-02-25', distance: 3.2, duration: '00:28:10', notes: 'Easy run.' },
    { id: '2', date: '2026-02-26', distance: 4.1, duration: '00:36:05', notes: '' },
  ])

  // Immutable updates only
  const addRun = (runDraft) => {
    const newRun = { id: makeId(), ...runDraft }
    setRuns((prev) => [newRun, ...prev])
    return newRun.id
  }

  const updateRun = (id, updates) => {
    setRuns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
  }

  const deleteRun = (id) => {
    setRuns((prev) => prev.filter((r) => r.id !== id))
  }

  const getRunById = (id) => runs.find((r) => String(r.id) === String(id))

  const value = useMemo(
    () => ({ runs, addRun, updateRun, deleteRun, getRunById }),
    [runs]
  )

  return <RunsContext.Provider value={value}>{children}</RunsContext.Provider>
}

export function useRuns() {
  const ctx = useContext(RunsContext)
  if (!ctx) throw new Error('useRuns must be used inside RunsProvider')
  return ctx
}



