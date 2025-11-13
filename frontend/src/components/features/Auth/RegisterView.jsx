import React from 'react'
import PropTypes from 'prop-types'

export default function RegisterView({
  form,
  setForm,
  error,
  loading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordStrength,
  passwordRequirements,
  handlePasswordChange,
  getStrengthColor,
  submit
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Join SubTrack</h2>
            <p className="text-blue-100 text-sm">Start managing your subscriptions effortlessly</p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <span className="w-5 h-5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter your username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                <input type="email" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

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

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Account...</>) : 'Create Account'}
            </button>

            <p className="text-center text-gray-600 text-sm">Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Sign in</a></p>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[{ icon: '📊', text: 'Track spending' }, { icon: '🔔', text: 'Get reminders' }, { icon: '📈', text: 'View analytics' }].map((feature, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20"><div className="text-2xl mb-2">{feature.icon}</div><p className="text-sm text-gray-600">{feature.text}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

RegisterView.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  error: PropTypes.any,
  loading: PropTypes.bool,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func.isRequired,
  showConfirmPassword: PropTypes.bool,
  setShowConfirmPassword: PropTypes.func.isRequired,
  passwordStrength: PropTypes.number,
  passwordRequirements: PropTypes.array.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  getStrengthColor: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
}
