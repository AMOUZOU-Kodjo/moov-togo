import { createContext, useContext, useState, useEffect } from 'react'
import { auth as authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('moov_token')
    if (token) {
      authApi.getProfile()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem('moov_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (phone, code) => {
    const res = await authApi.verifyOtp(phone, code)
    const { token, user: userData } = res.data.data
    localStorage.setItem('moov_token', token)
    setUser(userData)
  }

  const sendOtp = async (phone) => {
    await authApi.sendOtp(phone)
  }

  const logout = () => {
    localStorage.removeItem('moov_token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, sendOtp, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
