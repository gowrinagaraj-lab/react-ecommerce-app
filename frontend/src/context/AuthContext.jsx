import { createContext, useContext, useMemo, useState } from 'react'
import { apiFetch } from '../api/client'

const STORAGE_KEY = 'ecom_user'

const AuthContext = createContext(null)

const readStoredUser = () => {
 
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser)

  const persist = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setUser(data)
  }

console.log('AuthProvider rendered', persist)
console.log('user', user)

  const login = async (email, password) => {
    const data = await apiFetch('/users/login', {
      method: 'POST',
      body: { email, password },
    })
    persist(data)
    return data
  }

  const register = async (payload) => {
    const data = await apiFetch('/users/register', {
      method: 'POST',
      body: payload,
    })
    persist(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token: user?.token || null,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
