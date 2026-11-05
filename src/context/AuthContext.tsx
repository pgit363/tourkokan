'use client'

import { authApi, getStoredUser, getToken, removeToken, Role, setStoredUser, setToken, User } from '@/lib/api'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  /** Signed in as a real account — not signed out, not a guest. */
  isRealUser: boolean
  isGuest: boolean
  roles: Role[]
  isVendor: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginAsGuest: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Everything that has to be true of a user object before the UI reads it.
 *
 * Three places write one (`login`, `loginAsGuest`, `refreshUser`) and a fourth reads
 * one back out of `localStorage`, so this lives in one function: a coercion applied in
 * three of the four places is the shape of bug where a vendor is a vendor until they
 * reload.
 */
function normalizeUser(raw: User): User {
  return {
    ...raw,
    // The API has been seen to store this as the string "true".
    isGuest: raw.isGuest === true || (raw.isGuest as unknown) === 'true',
    // Absent and empty are different answers upstream, but not to a caller asking
    // "may this person see the dashboard" — see the mount effect, which is where the
    // difference is actually resolved.
    roles: Array.isArray(raw.roles) ? raw.roles : [],
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.userProfile()
      const updated = normalizeUser(res.data)
      setStoredUser(updated)
      setUser(updated)
    } catch {
      // token expired
      removeToken()
      setUser(null)
    }
  }, [])

  // On mount — restore user from localStorage and verify token is still valid
  useEffect(() => {
    const stored = getStoredUser()
    const hasToken = !!getToken()
    let cancelled = false

    if (stored && hasToken) {
      setUser(normalizeUser(stored))

      // A session cached by a build of this site that predates roles has no `roles`
      // key at all, which is not the same as holding none. Normalising it to `[]` and
      // stopping there would quietly lock an already-signed-in vendor out of their own
      // dashboard until they happened to sign in again, so re-read the profile instead.
      if (!Array.isArray(stored.roles)) {
        refreshUser().finally(() => {
          if (!cancelled) setIsLoading(false)
        })
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }

    const handleUnauthenticated = () => setUser(null)
    window.addEventListener('auth:unauthenticated', handleUnauthenticated)
    return () => {
      cancelled = true
      window.removeEventListener('auth:unauthenticated', handleUnauthenticated)
    }
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    if (!res?.access_token) throw new Error('Sign in failed. Please try again.')
    const signedIn = normalizeUser(res.user)
    setToken(res.access_token)
    setStoredUser(signedIn)
    setUser(signedIn)
  }

  const loginAsGuest = async () => {
    const guestName = `Guest_${Math.random().toString(36).slice(2, 10).toUpperCase()}`
    const res = await authApi.guestRegister(guestName)
    if (!res?.access_token) throw new Error('Could not continue as guest. Please try again.')
    const guestUser = normalizeUser({ ...res.user, isGuest: true })
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

  const roles = user?.roles ?? []
  const isGuest = !!user?.isGuest
  const isRealUser = !!user && !isGuest

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isRealUser,
        isGuest,
        roles,
        // A guest never holds a role the server would honour, so it is answered here
        // rather than left to each caller to remember.
        isVendor: isRealUser && roles.some((r) => r.code === 'vendor'),
        isLoading,
        login,
        loginAsGuest,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
