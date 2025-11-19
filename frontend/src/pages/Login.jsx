import React from 'react'
import { Navigate } from 'react-router-dom'
import LoginContainer from '../components/features/Auth/LoginContainer'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { user } = useAuth()

  // If already authenticated, redirect straight to dashboard
  if (user) return <Navigate to="/dashboard" replace />

  return <LoginContainer />
}