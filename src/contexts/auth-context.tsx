import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { api } from "@/lib/api"

export interface AuthUser {
  name: string
  email: string
  role: "supporter" | "creator" | "admin"
  photoURL: string
  credits: number
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  signUp: (email: string, password: string) => Promise<FirebaseUser>
  signInWithGoogle: () => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function getBackendToken(email: string) {
  const { token } = await api.post<{ token: string }>("/api/jwt", { email })
  localStorage.setItem("token", token)
  return token
}

async function fetchUserProfile(): Promise<AuthUser> {
  return api.get<AuthUser>("/api/users/me")
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await getBackendToken(firebaseUser.email!)
          const profile = await fetchUserProfile()
          setUser(profile)
        } catch {
          localStorage.removeItem("token")
          setUser(null)
        }
      } else {
        localStorage.removeItem("token")
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await getBackendToken(result.user.email!)
    const profile = await fetchUserProfile()
    setUser(profile)
    return profile
  }

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const idToken = await result.user.getIdToken()

    const data = await api.post<{ token: string; user: AuthUser }>("/api/auth/google", {
      token: idToken,
    })

    localStorage.setItem("token", data.token)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
