"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<{
  state: AuthState
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
} | null>(null)

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

const mockUser: User = {
  id: "user_123",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
  phone: "+1234567890",
  createdAt: "2024-01-01T00:00:00Z",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const login = async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }))

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Always succeed with mock user
    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    })
    return true
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }))

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Always succeed with mock user
    const newUser: User = {
      id: "user_" + Date.now(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
    }

    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    })
    return true
  }

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
