import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import MapPreview from '../components/runs/MapPreview'
import { useRuns } from '../contexts/RunsContext'

function RunDetailsPage() {
  const { id } = useParams()
  const { getRunById } = useRuns()

  const run = getRunById(id)

  if (!run) {
    return (
      <Card>
        <h2>Run not found</h2>
        <Link to="/runs">
          <Button>Back to Runs</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <h2>Run Details</h2>
          <Link to="/runs">
            <Button>Back to Runs</Button>
          </Link>
        </div>

        <div style={{ marginTop: '12px', display: 'grid', gap: '6px' }}>
          <div><strong>Date:</strong> {run.date}</div>
          <div><strong>Distance:</strong> {run.distance} mi</div>
          <div><strong>Duration:</strong> {run.duration}</div>
          <div><strong>Notes:</strong> {run.notes || '--'}</div>
        </div>
      </Card>

      <MapPreview />
    </div>
  )
}

export default RunDetailsPage