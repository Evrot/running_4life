import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import MapPreview from './MapPreview'
import { useRuns } from '../../contexts/RunsContext'

const CSRF_KEY = 'running4life_csrf_token'

function generateCsrfToken() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function sanitizeNotes(value) {
  return value.replace(/[<>]/g, '').trim()
}

function isValidDuration(value) {
  return /^(\d{1,2}):([0-5]\d):([0-5]\d)$/.test(value)
}

function RunForm() {
  const navigate = useNavigate()
  const { addRun } = useRuns()

  const [date, setDate] = useState('')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    let token = sessionStorage.getItem(CSRF_KEY)

    if (!token) {
      token = generateCsrfToken()
      sessionStorage.setItem(CSRF_KEY, token)
    }

    setCsrfToken(token)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')

    const storedCsrfToken = sessionStorage.getItem(CSRF_KEY)
    const normalizedDate = date.trim()
    const normalizedDuration = duration.trim()
    const sanitizedNotes = sanitizeNotes(notes)

    if (!normalizedDate || !distance || !normalizedDuration) {
      setError('Please fill date, distance, and duration.')
      return
    }

    const distanceNum = Number(distance)
    if (Number.isNaN(distanceNum) || distanceNum <= 0) {
      setError('Distance must be a positive number.')
      return
    }

    if (distanceNum > 200) {
      setError('Distance is too large.')
      return
    }

    if (!isValidDuration(normalizedDuration)) {
      setError('Duration must use HH:MM:SS format.')
      return
    }

    if (sanitizedNotes.length > 500) {
      setError('Notes must be 500 characters or less.')
      return
    }

    if (!csrfToken || !storedCsrfToken || csrfToken !== storedCsrfToken) {
      setError('Security validation failed. Please refresh and try again.')
      return
    }

    setIsSubmitting(true)

    try {
      const newId = addRun({
        date: normalizedDate,
        distance: distanceNum,
        duration: normalizedDuration,
        notes: sanitizedNotes,
      })

      navigate(`/runs/${newId}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <h3>Run Details</h3>
      <Alert message={error} />

      <MapPreview onDistanceChange={setDistance} />

      <form onSubmit={onSubmit} noValidate>
        <input type="hidden" name="csrfToken" value={csrfToken} />

        <div>
          <label htmlFor="run-date">Date</label>
          <Input
            id="run-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="run-distance">Distance (miles)</label>
          <Input
            id="run-distance"
            type="number"
            step="0.1"
            min="0.1"
            max="200"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="run-duration">Duration</label>
          <Input
            id="run-duration"
            type="text"
            placeholder="00:30:00"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            maxLength={8}
            required
          />
        </div>

        <div>
          <label htmlFor="run-notes">Notes</label>
          <Textarea
            id="run-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            placeholder="Optional notes about your run"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Run'}
        </Button>
      </form>
    </Card>
  )
}

export default RunForm