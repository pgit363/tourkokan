'use client'

import { authApi, getStoredUser, getToken, removeToken, setStoredUser, setToken, User } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
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
      setUser(stored)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    setToken(res.access_token)
    setStoredUser(res.user)
    setUser(res.user)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore errors on logout
    } finally {
      removeToken()
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
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
