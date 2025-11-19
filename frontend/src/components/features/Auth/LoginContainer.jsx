import React, { useState, useCallback } from 'react'
import useAuth from '../../../hooks/useAuth'
import LoginView from './LoginView'

export default function LoginContainer() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
  const res = await login(form)
      if (!res || !res.success) {
        setError(res?.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }


 
  return (
    <LoginView
      form={form}
      setForm={setForm}
      error={error}
      loading={loading}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      submit={submit}
    />
  )
}
