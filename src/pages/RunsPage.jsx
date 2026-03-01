import RunList from '../components/runs/RunList'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { useRuns } from '../contexts/RunsContext'

function RunsPage() {
  const { runs } = useRuns()

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <h2>Runs</h2>
          <Link to="/runs/new">
            <Button>Add Run</Button>
          </Link>
        </div>
        <p style={{ marginTop: '8px' }}>Click a run to view details.</p>
      </Card>

      <RunList runs={runs} />
    </div>
  )
}

export default RunsPage