import { useAuth } from '../context/AuthContext'
import ProductList from './ProductList'
import './Dashboard.css'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>Welcome back, {user.name}</h1>
        <p className="muted">
          Signed in as <strong>{user.role}</strong>.{' '}
          {isAdmin
            ? 'You can add, edit and remove products below.'
            : 'Browse, filter and sort the catalogue below.'}
        </p>
      </div>

      <ProductList />
    </div>
  )
}

export default Dashboard
