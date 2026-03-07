import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'running4life_token'
const USER_KEY = 'running4life_user'
const USERS_KEY = 'running4life_users'
const EXP_KEY = 'running4life_token_exp'

function createMockToken(email) {
  return btoa(`${email}:${Date.now()}`)
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(EXP_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    setToken(null)
  }, [])

  useEffect(() => {
    const savedToken = sessionStorage.getItem(TOKEN_KEY)
    const savedUser = sessionStorage.getItem(USER_KEY)
    const savedExp = sessionStorage.getItem(EXP_KEY)

    if (!savedToken || !savedUser || !savedExp) return

    const isExpired = Date.now() > Number(savedExp)
    if (isExpired) {
      logout()
      return
    }

    try {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    if (!token) return

    const savedExp = sessionStorage.getItem(EXP_KEY)
    if (!savedExp) return

    const msRemaining = Number(savedExp) - Date.now()
    if (msRemaining <= 0) {
      logout()
      return
    }

    const timer = setTimeout(() => {
      logout()
    }, msRemaining)

    return () => clearTimeout(timer)
  }, [token, logout])

  const register = ({ name, email, password }) => {
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()

    const existingUser = users.find((u) => u.email === normalizedEmail)
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' }
    }

    const newUser = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      name: normalizedName,
      email: normalizedEmail,
      password, // demo only; real apps must never store passwords in frontend storage
    }

    const updatedUsers = [...users, newUser]
    saveStoredUsers(updatedUsers)

    return { success: true }
  }

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()

    const existingUser = users.find(
      (u) => u.email === normalizedEmail && u.password === password
    )

    if (!existingUser) {
      return { success: false, message: 'Invalid email or password.' }
    }

    const authUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    }

    const newToken = createMockToken(existingUser.email)
    const expiration = Date.now() + 60 * 60 * 1000

    sessionStorage.setItem(TOKEN_KEY, newToken)
    sessionStorage.setItem(USER_KEY, JSON.stringify(authUser))
    sessionStorage.setItem(EXP_KEY, String(expiration))

    setUser(authUser)
    setToken(newToken)

    return { success: true }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      register,
      login,
      logout,
    }),
    [user, token, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext