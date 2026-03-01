import StatsSummary from '../components/runs/StatsSummary'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { useRuns } from '../contexts/RunsContext'

function HomePage() {
  const { runs } = useRuns()

  const totalRuns = runs.length
  const totalDistance = runs.reduce((sum, r) => sum + (Number(r.distance) || 0), 0)

  const summary = {
    totalRuns,
    totalDistance: Number(totalDistance.toFixed(1)),
    avgPace: '--', // pace calculation to be added later
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

      <StatsSummary summary={summary} />
    </div>
  )
}

export default HomePage