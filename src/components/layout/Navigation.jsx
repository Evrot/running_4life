import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/runs">Runs</Link></li>
        <li><Link to="/runs/new">Add Run</Link></li>
      </ul>
    </nav>
  )
}

export default Navigation