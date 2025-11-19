import React, { useState, useMemo } from 'react'
import RegisterView from './RegisterView'
import useAuth from '../../../hooks/useAuth'

function scorePassword(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 30
  if (/[A-Z]/.test(password)) score += 20
  if (/[0-9]/.test(password)) score += 20
  if (/[^A-Za-z0-9]/.test(password)) score += 30
  return Math.min(100, score)
}

function getRequirements(password) {
  const reqs = [
    { id: 'len', text: 'At least 8 characters', met: password.length >= 8 },
    { id: 'upper', text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'number', text: 'One number', met: /[0-9]/.test(password) },
    { id: 'symbol', text: 'One special character', met: /[^A-Za-z0-9]/.test(password) }
  ]
  return reqs
}

export default function RegisterContainer() {
  const { register } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordStrength = useMemo(() => scorePassword(form.password), [form.password])
  const passwordRequirements = useMemo(() => getRequirements(form.password || ''), [form.password])

  function getStrengthColor(score) {
    if (score <= 40) return 'bg-red-500'
    if (score <= 80) return 'bg-yellow-400'
    return 'bg-green-400'
  }

  function handlePasswordChange(value) {
    setForm(prev => ({ ...prev, password: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const payload = { username: form.username, email: form.email, password: form.password }
      const res = await register(payload)
      if (!res || !res.success) {
        setError(res?.message || 'Failed to create account')
      }
    } catch (err) {
      setError(err?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterView
      form={form}
      setForm={setForm}
      error={error}
      loading={loading}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      passwordStrength={passwordStrength}
      passwordRequirements={passwordRequirements}
      handlePasswordChange={handlePasswordChange}
      getStrengthColor={getStrengthColor}
      submit={submit}
    />
  )
}
