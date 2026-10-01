import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../services/firebase'

interface AuthUser {
  email: string | null
}

const DEV_AUTH_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_AUTH !== 'false'
const DEV_ADMIN_EMAIL = import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@bronxbarber.com'
const DEV_ADMIN_PASSWORD = import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'admin123'
const DEV_AUTH_STORAGE_KEY = 'bronx_dev_admin_email'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEV_AUTH_ENABLED) {
      const savedEmail = localStorage.getItem(DEV_AUTH_STORAGE_KEY)
      setUser(savedEmail ? { email: savedEmail } : null)
      setLoading(false)
      return
    }

    const loadingTimeout = setTimeout(() => {
      // Prevent app lock if Firebase auth initialization hangs.
      setLoading(false)
    }, 4000)

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          clearTimeout(loadingTimeout)
          setUser(firebaseUser ? { email: firebaseUser.email } : null)
          setLoading(false)
        },
        () => {
          clearTimeout(loadingTimeout)
          setLoading(false)
        },
      )

      return () => {
        clearTimeout(loadingTimeout)
        unsubscribe()
      }
    } catch {
      clearTimeout(loadingTimeout)
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (DEV_AUTH_ENABLED) {
      const normalizedEmail = email.trim().toLowerCase()
      if (normalizedEmail !== DEV_ADMIN_EMAIL.toLowerCase() || password !== DEV_ADMIN_PASSWORD) {
        throw new Error('Invalid development credentials')
      }

      localStorage.setItem(DEV_AUTH_STORAGE_KEY, normalizedEmail)
      setUser({ email: normalizedEmail })
      return
    }

    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    if (DEV_AUTH_ENABLED) {
      localStorage.removeItem(DEV_AUTH_STORAGE_KEY)
      setUser(null)
      return
    }

    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
