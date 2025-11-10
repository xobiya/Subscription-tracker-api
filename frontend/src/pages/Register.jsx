import React, { useState, useContext } from 'react'
import api from '../api'
import useAuth from '../hooks/useAuth'

export default function Register() {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { register } = useAuth()

  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters', met: form.password.length >= 8 },
    { id: 2, text: 'Contains uppercase letter', met: /[A-Z]/.test(form.password) },
    { id: 3, text: 'Contains lowercase letter', met: /[a-z]/.test(form.password) },
    { id: 4, text: 'Contains number', met: /[0-9]/.test(form.password) },
    { id: 5, text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(form.password) },
  ]

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20
    return strength
  }

  const handlePasswordChange = (password) => {
    setForm({...form, password})
    setPasswordStrength(calculatePasswordStrength(password))
  }

  const getStrengthColor = (strength) => {
    if (strength <= 40) return 'bg-red-500'
    if (strength <= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (passwordStrength < 80) {
      setError('Please choose a stronger password')
      setLoading(false)
      return
    }

    try {
      const res = await register({
        username: form.username,
        email: form.email,
        password: form.password
      })
      
      if(!res?.success){
        setError(res?.message || 'Failed to register')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Join SubTrack</h2>
            <p className="text-blue-100 text-sm">Start managing your subscriptions effortlessly</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <span className="w-5 h-5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter your username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                <input type="email" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                <input type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Create a password" value={form.password} onChange={e => handlePasswordChange(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? '🙈' : '👁️'}</button>
              </div>

              {form.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Password strength</span>
                    <span className={`font-medium ${passwordStrength <= 40 ? 'text-red-600' : passwordStrength <= 80 ? 'text-yellow-600' : 'text-green-600'}`}>{passwordStrength <= 40 ? 'Weak' : passwordStrength <= 80 ? 'Good' : 'Strong'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`} style={{ width: `${passwordStrength}%` }} />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {form.password && (
                <div className="mt-3 space-y-2">
                  {passwordRequirements.map(req => (
                    <div key={req.id} className="flex items-center gap-2 text-xs">
                      <span className={req.met ? 'text-green-500' : 'text-gray-300'}>{req.met ? '✅' : '◻️'}</span>
                      <span className={req.met ? 'text-green-600' : 'text-gray-500'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                <input type={showConfirmPassword ? 'text' : 'password'} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Confirm your password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showConfirmPassword ? '🙈' : '👁️'}</button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in
              </a>
            </p>
          </form>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: '📊', text: 'Track spending' },
            { icon: '🔔', text: 'Get reminders' },
            { icon: '📈', text: 'View analytics' }
          ].map((feature, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}