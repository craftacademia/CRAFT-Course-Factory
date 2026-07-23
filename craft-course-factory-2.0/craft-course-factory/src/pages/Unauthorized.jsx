import React from 'react'
import { Link } from 'react-router-dom'

export const Unauthorized = () => {
  return (
    <div className="page-container flex-center">
      <div className="card text-center">
        <h2>403 - Access Denied</h2>
        <p>You do not have the required permissions to access this page.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized
