// Centralized API client with interceptors and error handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface ApiConfig extends RequestInit {
  params?: Record<string, any>
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem("authToken", token)
    } else {
      localStorage.removeItem("authToken")
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  private getHeaders(config?: ApiConfig): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...config?.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  async request<T>(endpoint: string, config: ApiConfig = {}): Promise<T> {
    const { params, ...fetchConfig } = config
    const url = this.buildUrl(endpoint, params)

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers: this.getHeaders(config),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "An error occurred",
        }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("[ApiClient] Error:", error)
      throw error
    }
  }

  get<T>(endpoint: string, config?: ApiConfig) {
    return this.request<T>(endpoint, { ...config, method: "GET" })
  }

  post<T>(endpoint: string, body?: any, config?: ApiConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(endpoint: string, body?: any, config?: ApiConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(endpoint: string, config?: ApiConfig) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" })
  }

  patch<T>(endpoint: string, body?: any, config?: ApiConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
