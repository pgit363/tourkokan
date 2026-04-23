'use client'

import { authApi, getStoredUser, getToken, removeToken, setStoredUser, setToken, User } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginAsGuest: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount — restore user from localStorage and verify token is still valid
  useEffect(() => {
    const stored = getStoredUser()
    if (stored && getToken()) {
      // normalize isGuest to boolean — API may have stored it as string "true"
      setUser({ ...stored, isGuest: stored.isGuest === true || (stored.isGuest as unknown) === 'true' })
    }
    setIsLoading(false)

    const handleUnauthenticated = () => setUser(null)
    window.addEventListener('auth:unauthenticated', handleUnauthenticated)
    return () => window.removeEventListener('auth:unauthenticated', handleUnauthenticated)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    setToken(res.access_token)
    setStoredUser(res.user)
    setUser(res.user)
  }

  const loginAsGuest = async () => {
    const guestName = `Guest_${Math.random().toString(36).slice(2, 10).toUpperCase()}`
    const res = await authApi.guestRegister(guestName)
    const guestUser = { ...res.user, isGuest: true }
    setToken(res.access_token)
    setStoredUser(guestUser)
    setUser(guestUser)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore errors on logout
    } finally {
      if (typeof window !== 'undefined') localStorage.clear()
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const res = await authApi.userProfile()
      const updated = res.data
      setStoredUser(updated)
      setUser(updated)
    } catch {
      // token expired
      removeToken()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, loginAsGuest, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
