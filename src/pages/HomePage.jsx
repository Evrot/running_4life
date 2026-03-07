import StatsSummary from '../components/runs/StatsSummary'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { useRuns } from '../contexts/RunsContext'
import { useAuth } from '../contexts/AuthContext'

import logo from '../assets/Dynamic Astronaut with Cowboy Hat Logo (1024 x 1024 px).svg'

function parseDurationToSeconds(duration) {
  if (!duration || typeof duration !== 'string') return 0

  const parts = duration.split(':').map(Number)

  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0

  const [hours, minutes, seconds] = parts
  return hours * 3600 + minutes * 60 + seconds
}

function formatPace(secondsPerMile) {
  if (!Number.isFinite(secondsPerMile) || secondsPerMile <= 0) return '--'

  const minutes = Math.floor(secondsPerMile / 60)
  const seconds = Math.round(secondsPerMile % 60)

  return `${minutes}:${String(seconds).padStart(2, '0')} /mi`
}

function HomePage() {
  const { runs } = useRuns()
  const { isAuthenticated } = useAuth()

  const totalRuns = runs.length
  const totalDistance = runs.reduce((sum, r) => sum + (Number(r.distance) || 0), 0)
  const totalSeconds = runs.reduce(
    (sum, r) => sum + parseDurationToSeconds(r.duration),
    0
  )

  const avgPace =
    totalDistance > 0 ? formatPace(totalSeconds / totalDistance) : '--'

  const summary = {
    totalRuns,
    totalDistance: Number(totalDistance.toFixed(1)),
    avgPace,
  }

  return (
  <div style={{ display: 'grid', gap: '16px' }}>
    <Card>
      <h2>Running 4Life</h2>
      <p>Your simple running log + route visualizer.</p>

      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/runs"><Button>View Runs</Button></Link>
        <Link to="/runs/new"><Button>Add Run</Button></Link>
      </div>
    </Card>

    
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={logo}
          alt="Running 4Life Logo"
          style={{
            width: '260px',
            height: '260px',
            objectFit: 'cover',
            borderRadius: '50%',
            border: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            textAlign: "center"
          }}
        />
      </div>

      {isAuthenticated && <StatsSummary summary={summary} />}
    </div>
  )
}

export default HomePage