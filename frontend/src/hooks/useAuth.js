import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import authService from '../services/authService'

export default function useAuth(){
  const { save, logout: contextLogout } = useContext(AuthContext)
  const navigate = useNavigate()

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    
    if (res && res.success) {
      // Try multiple possible locations for user/token in the API response
      const extractAuth = (r) => {
        const candidates = [r?.data?.data, r?.data, r]
        for (const c of candidates) {
          if (!c || typeof c !== 'object') continue
          const user = c.user ?? (typeof c === 'object' && (c.username || c.email || c.id || c._id) ? c : null) ?? c.data?.user
          const token = c.token ?? c.accessToken ?? c.access_token ?? c.data?.token ?? r?.token
          if (user || token) return { user, token, candidate: c }
        }
        return { user: null, token: null, candidate: null }
      }

      const { user: userObj, token: tokenVal, candidate } = extractAuth(res)
      

      // only save what we have
      if (userObj || tokenVal) save(userObj || null, tokenVal || null)
      // navigate to dashboard by default
      navigate('/dashboard')
      // sanity check: warn if token or user missing after successful response
      
    }
    return res
  }

  const register = async (payloadData) => {
    const res = await authService.register(payloadData)
    
    if (res && res.success) {
      // reuse the same robust extractor as login
      const extractAuth = (r) => {
        const candidates = [r?.data?.data, r?.data, r]
        for (const c of candidates) {
          if (!c || typeof c !== 'object') continue
          const user = c.user ?? (typeof c === 'object' && (c.username || c.email || c.id || c._id) ? c : null) ?? c.data?.user
          const token = c.token ?? c.accessToken ?? c.access_token ?? c.data?.token ?? r?.token
          if (user || token) return { user, token, candidate: c }
        }
        return { user: null, token: null, candidate: null }
      }

      const { user: userObj, token: tokenVal, candidate } = extractAuth(res)
      if (userObj || tokenVal) save(userObj || null, tokenVal || null)
      navigate('/dashboard')
    }
    return res
  }

  const logout = () => {
    // clear auth from context and redirect to login page
    try {
      contextLogout()
    } finally {
      navigate('/login')
    }
  }

  return { login, register, logout }
}
