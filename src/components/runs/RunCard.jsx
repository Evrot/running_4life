import Card from '../ui/Card'
import { Link } from 'react-router-dom'

function RunCard({ run }) {
  return (
    <Link to={`/runs/${run.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card>
        <h3>{run.date}</h3>
        <p>Distance: {run.distance} mi</p>
        <p>Duration: {run.duration}</p>
      </Card>
    </Link>
  )
}

export default RunCard