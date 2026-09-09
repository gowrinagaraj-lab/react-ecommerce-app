import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeButton from './ThemeButton'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  console.log('Navbar rendered', { user, isAuthenticated, logout  })
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">Shoply</Link>

      <nav className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chat">AI Assistant</Link>
            <div className="navbar-user-menu" ref={menuRef}>
              <button
                type="button"
                className="navbar-user"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
              >
   
                <span className={`role-badge role-${user.role}`}>             {user.name} ({user.role})</span>
              </button>
              {menuOpen && (
                <div className="navbar-user-dropdown">
                  <button type="button" className="btn-secondary" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <ThemeButton />
      </nav>
    </header>
  )
}

export default Navbar
