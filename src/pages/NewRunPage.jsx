import RunForm from '../components/runs/RunForm'
import MapPreview from '../components/runs/MapPreview'
import Card from '../components/ui/Card'

function NewRunPage() {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Card>
        <h2>Add a Run</h2>
        <p>Enter run details and (later) select a route on the map.</p>
      </Card>

      <div style={{ display: 'grid', gap: '16px' }}>
        <RunForm />
        <MapPreview />
      </div>
    </div>
  )
}

export default NewRunPage