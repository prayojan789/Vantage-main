import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'vantage-auth-user'
const TOKEN_KEY = 'vantage-access-token'

function readSession() {
  if (typeof window === 'undefined') return null
  try {
    const userRaw = window.localStorage.getItem(STORAGE_KEY)
    const token = window.localStorage.getItem(TOKEN_KEY)
    if (!userRaw || !token) return null
    return { ...JSON.parse(userRaw), token }
  } catch {
    return null
  }
}

function writeSession(user, token) {
  if (typeof window === 'undefined') return
  if (user && token) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    window.localStorage.setItem(TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(TOKEN_KEY)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setHydrated(true) }, [])

  // Listen for auth:logout events dispatched by the API interceptor on 401.
  // This keeps the React auth state in sync without a hard page reload.
  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
      writeSession(null, null)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const normalizedEmail = (email || '').trim().toLowerCase()
    if (!normalizedEmail || !password) {
      return { ok: false, error: 'Email and password are required.' }
    }

    try {
      // FastAPI OAuth2PasswordRequestForm expects 'username' and 'password'.
      // We use FormData to match the backend's OAuth2 requirement.
      const formData = new FormData()
      formData.append('username', normalizedEmail)
      formData.append('password', password)

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.access_token) {
        const session = {
          email: normalizedEmail,
          signedInAt: new Date().toISOString(),
        }
        setUser(session)
        writeSession(session, response.access_token)
        return { ok: true, user: session }
      }
      return { ok: false, error: 'Login failed.' }
    } catch (err) {
      return { ok: false, error: err.message || 'An error occurred during sign in.' }
    }
  }, [])

  const signUp = useCallback(async ({ name, email, password }) => {
    const cleanName = (name || '').trim()
    const normalizedEmail = (email || '').trim().toLowerCase()

    if (!cleanName || !normalizedEmail || !password) {
      return { ok: false, error: 'All fields are required.' }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'Invalid email address.' }
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }

    try {
      const response = await api.post('/auth/signup', {
        email: normalizedEmail,
        password: password,
        full_name: cleanName
      })

      if (response && response.email) {
        // Auto-login after signup
        const loginRes = await signIn({ email: normalizedEmail, password })
        return loginRes
      }
      return { ok: false, error: 'Sign up failed.' }
    } catch (err) {
      return { ok: false, error: err.message || 'An error occurred during sign up.' }
    }
  }, [signIn])

  const signOut = useCallback(async () => {
    // Clear auth state immediately (before the async API call) so that
    // navigation to /sign-in sees user === null without delay.
    setUser(null)
    writeSession(null, null)
    // Then call the backend logout endpoint (fire-and-forget)
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore errors — logout is primarily client-side for JWT
    }
  }, [])

  const signInWithGoogle = useCallback(async (idToken) => {
    try {
      const response = await api.post('/auth/google/token', { token: idToken })
      if (response && response.access_token) {
        const session = {
          email: response.email,
          full_name: response.full_name,
          signedInAt: new Date().toISOString(),
        }
        setUser(session)
        writeSession(session, response.access_token)
        return { ok: true, user: session }
      }
      return { ok: false, error: 'Google sign-in failed.' }
    } catch (err) {
      return { ok: false, error: err.message || 'An error occurred during Google sign-in.' }
    }
  }, [])

  const value = useMemo(
    () => ({ user, hydrated, signIn, signUp, signOut, signInWithGoogle }),
    [user, hydrated, signIn, signUp, signOut, signInWithGoogle],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    return {
      user: null,
      hydrated: false,
      signIn: async () => ({ ok: false, error: 'Auth not available' }),
      signUp: async () => ({ ok: false, error: 'Auth not available' }),
      signOut: async () => {},
    }
  }
  return ctx
}
