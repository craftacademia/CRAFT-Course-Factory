import React from 'react'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h2>CRAFT Course Factory 2.0</h2>
      </div>
      {user && (
        <div className="navbar-user">
          <span className="user-info">
            <strong>{user.name}</strong> <small>({user.role})</small>
          </span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
