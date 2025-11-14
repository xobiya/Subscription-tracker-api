import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import authService from '../services/authService'

export default function useAuth(){
  const { save, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    if(res.success){
      const payload = res.data || {}
      save(payload.user || payload, payload.token || payload.token)
      // navigate to home by default
      navigate('/')
    }
    return res
  }

  const register = async (data) => {
    const res = await authService.register(data)
    if(res.success){
      const payload = res.data || {}
      save(payload.user || payload, payload.token || payload.token)
      navigate('/')
    }
    return res
  }

  return { login, register, logout }
}
