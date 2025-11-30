"use client"

// Custom hook for authentication context
import { useCallback, useEffect, useState } from "react"
import type { User, UserRole } from "@/types"
import { apiClient } from "@/lib/api-client"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize auth state from token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (token) {
          apiClient.setToken(token)
          const user = await apiClient.get<User>("/auth/me")
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } else {
          setState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Auth error",
        }))
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { token, user } = await apiClient.post<{
        token: string
        user: User
      }>("/auth/login", { email, password })

      apiClient.setToken(token)
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
      throw error
    }
  }, [])

  const register = useCallback(
    async (userData: {
      name: string
      email: string
      password: string
      role: UserRole
      faculty: string
    }) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      try {
        const { token, user } = await apiClient.post<{
          token: string
          user: User
        }>("/auth/register", userData)

        apiClient.setToken(token)
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed"
        setState((prev) => ({ ...prev, isLoading: false, error: message }))
        throw error
      }
    },
    [],
  )

  const logout = useCallback(() => {
    apiClient.setToken(null)
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
  }
}
