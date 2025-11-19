import React from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Twitter } from 'lucide-react'
// Inline Google SVG so tests / SSR don't need an external icon package
const GoogleIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M23.6 12.3c0-.8-.1-1.6-.3-2.3H12v4.3h6.5c-.3 1.9-1.5 3.4-3.1 4.5v3h5c2.9-2.7 4.6-6.7 4.6-9.5z"/>
    <path fill="#34A853" d="M12 24c3.2 0 5.9-1 7.9-2.8l-3-2.3c-.8.5-2 1.1-4.9 1.1-3.8 0-7-2.6-8.1-6.2H1v3.9C3 20.9 7.2 24 12 24z"/>
    <path fill="#FBBC05" d="M3.9 14.7c-.2-.6-.3-1.2-.3-1.8 0-.6.1-1.2.3-1.8V7.2H1C-.1 9.4-.1 11.8 1 14l2.9.7z"/>
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4C17.8 1.2 15 0 12 0 7.2 0 3 3.1 1 7.2l2.9 2.5C5 7.4 8.2 4.8 12 4.8z"/>
    <path fill="none" d="M0 0h24v24H0z"/>
  </svg>
)
import Button from '../../../components/ui/Button'

export default function LoginView({
  form,
  setForm,
  error,
  loading,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  submit,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center">
            <motion.h2 initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-3xl font-bold text-white mb-2">Welcome Back</motion.h2>
            <p className="text-green-100 text-sm">Sign in to manage your subscriptions</p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                Remember me
              </label>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing In...</>) : (<>Sign In<ArrowRight className="w-5 h-5" /></>)}
            </motion.button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"><GoogleIcon className="w-5 h-5" /><span className="text-sm font-medium">Google</span></motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"><Twitter className="w-5 h-5" /><span className="text-sm font-medium">Twitter</span></motion.button>
            </div>

            <p className="text-center text-gray-600 text-sm">Don't have an account? <a href="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors">Create one now</a></p>
          </form>
        </div>

        {/* Feature cards and demo helper removed per request */}
      </motion.div>
    </div>
  )
}

LoginView.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  error: PropTypes.any,
  loading: PropTypes.bool,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func.isRequired,
  rememberMe: PropTypes.bool,
  setRememberMe: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  
}
