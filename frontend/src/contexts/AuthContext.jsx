import React, { createContext, useState, useEffect, useContext } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed.user)
        setToken(parsed.token)
      } catch (e) {
        // ignore malformed
      }
    }
  }, [])

  const save = (userData, tokenValue) => {
    setUser(userData)
    setToken(tokenValue)
    try {
      localStorage.setItem('auth', JSON.stringify({ user: userData, token: tokenValue }))
    } catch (e) {
      // storage failed (private mode?), ignore
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try { localStorage.removeItem('auth') } catch (e) { /* ignore */ }
  }

  const getToken = () => token
  const getUser = () => user

  return (
    <AuthContext.Provider value={{ user, token, save, logout, getToken, getUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
