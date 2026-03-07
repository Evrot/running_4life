import React, { createContext, useContext, useMemo, useState } from 'react'

const RunsContext = createContext(null)

function makeId() {
  return crypto?.randomUUID?.() ?? String(Date.now())
}

function sanitizeNotes(value = '') {
  return String(value).replace(/[<>]/g, '').trim().slice(0, 500)
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isValidDuration(value) {
  return /^(\d{1,2}):([0-5]\d):([0-5]\d)$/.test(value)
}

function sanitizeRun(runDraft) {
  const safeDate = String(runDraft.date ?? '').trim()
  const safeDistance = Number(runDraft.distance)
  const safeDuration = String(runDraft.duration ?? '').trim()
  const safeNotes = sanitizeNotes(runDraft.notes)

  if (!isValidDate(safeDate)) {
    throw new Error('Invalid run date.')
  }

  if (Number.isNaN(safeDistance) || safeDistance <= 0 || safeDistance > 200) {
    throw new Error('Invalid run distance.')
  }

  if (!isValidDuration(safeDuration)) {
    throw new Error('Invalid run duration.')
  }

  return {
    date: safeDate,
    distance: safeDistance,
    duration: safeDuration,
    notes: safeNotes,
  }
}

function sanitizeRunUpdates(updates) {
  const safeUpdates = {}

  if ('date' in updates) {
    const safeDate = String(updates.date ?? '').trim()
    if (!isValidDate(safeDate)) {
      throw new Error('Invalid run date.')
    }
    safeUpdates.date = safeDate
  }

  if ('distance' in updates) {
    const safeDistance = Number(updates.distance)
    if (Number.isNaN(safeDistance) || safeDistance <= 0 || safeDistance > 200) {
      throw new Error('Invalid run distance.')
    }
    safeUpdates.distance = safeDistance
  }

  if ('duration' in updates) {
    const safeDuration = String(updates.duration ?? '').trim()
    if (!isValidDuration(safeDuration)) {
      throw new Error('Invalid run duration.')
    }
    safeUpdates.duration = safeDuration
  }

  if ('notes' in updates) {
    safeUpdates.notes = sanitizeNotes(updates.notes)
  }

  return safeUpdates
}

export function RunsProvider({ children }) {
  const [runs, setRuns] = useState([])

  const addRun = (runDraft) => {
    const safeRun = sanitizeRun(runDraft)
    const newRun = { id: makeId(), ...safeRun }

    setRuns((prev) => [newRun, ...prev])
    return newRun.id
  }

  const updateRun = (id, updates) => {
    const safeUpdates = sanitizeRunUpdates(updates)

    setRuns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...safeUpdates } : r))
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