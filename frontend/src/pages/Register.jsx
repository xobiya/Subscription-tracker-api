import React from 'react'
import { Navigate } from 'react-router-dom'
import RegisterContainer from '../components/features/Auth/RegisterContainer'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { user } = useAuth()

  // If already authenticated, redirect to dashboard
  if (user) return <Navigate to="/dashboard" replace />

  return <RegisterContainer />
}