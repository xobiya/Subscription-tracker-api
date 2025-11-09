import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext)
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <Link to="/" className="font-bold text-lg">SubDub</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.username || user.name}</span>
              <Link to="/subscriptions" className="text-sm text-gray-700">Subscriptions</Link>
              <button onClick={logout} className="text-sm text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700">Login</Link>
              <Link to="/register" className="text-sm text-blue-600">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
