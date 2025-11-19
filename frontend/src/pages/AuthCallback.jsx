import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback(){
  const location = useLocation()
  const navigate = useNavigate()
  const { save } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (error) {
      // If provider returned an error, go back to login
      navigate('/login', { replace: true })
      return
    }

    if (!token) {
      // No token: treat as failed auth
      navigate('/login', { replace: true })
      return
    }

    // Save token (user will be fetched lazily by the app when needed).
    // AuthContext.save accepts (user, token). We don't have user info here.
    save(null, token)

    // Redirect to dashboard
    navigate('/dashboard', { replace: true })
  }, [location.search])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Signing you in…</p>
      </div>
    </div>
  )
}
