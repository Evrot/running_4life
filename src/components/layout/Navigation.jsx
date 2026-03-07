import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'

function Navigation() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <ul>
        <li><Link to="/">Home</Link></li>

        {isAuthenticated && (
          <>
            <li><Link to="/runs">Runs</Link></li>
            <li><Link to="/runs/new">Add Run</Link></li>
          </>
        )}

        {!isAuthenticated && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}

        {isAuthenticated && (
          <li>
            <Button onClick={handleLogout}>Logout</Button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navigation