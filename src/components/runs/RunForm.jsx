import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import { useRuns } from '../../contexts/RunsContext'

function RunForm() {
  const navigate = useNavigate()
  const { addRun } = useRuns()

  // Local component state
  const [date, setDate] = useState('')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!date || !distance || !duration) {
      setError('Please fill date, distance, and duration.')
      return
    }

    const distanceNum = Number(distance)
    if (Number.isNaN(distanceNum) || distanceNum <= 0) {
      setError('Distance must be a positive number.')
      return
    }

    const newId = addRun({
      date,
      distance: distanceNum,
      duration,
      notes,
    })

    // Go to details page for proof your routing + context works
    navigate(`/runs/${newId}`)
  }

  return (
    <Card>
      <h3>Run Details</h3>
      <Alert message={error} />

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="run-date">Date</label>
          <Input
            id="run-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="run-distance">Distance (miles)</label>
          <Input
            id="run-distance"
            type="number"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
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
          />
        </div>

        <div>
          <label htmlFor="run-notes">Notes</label>
          <Textarea
            id="run-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button type="submit">Save Run</Button>
      </form>
    </Card>
  )
}

export default RunForm