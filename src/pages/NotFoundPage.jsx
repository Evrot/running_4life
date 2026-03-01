import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function NotFoundPage() {
  return (
    <Card>
      <h2>404 - Page Not Found</h2>
      <p>The page you’re looking for doesn’t exist.</p>

      <div style={{ marginTop: '12px' }}>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </Card>
  )
}

export default NotFoundPage